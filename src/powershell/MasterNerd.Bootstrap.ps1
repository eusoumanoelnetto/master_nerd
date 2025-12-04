<#
.SYNOPSIS
    Console bootstrap do projeto Master Nerd com estética CRT e utilidades básicas.
.DESCRIPTION
    Ajusta o tema do console, garante estrutura de pastas e oferece diagnósticos e
    preparação inicial para fluxos de automação e criação de pendrive bootável.
#>
[CmdletBinding()]
param(
    [ValidateSet("Interactive","Setup","Diagnostics","UsbDryRun","All","MenuPreview")]
    [string]$Action = "Interactive",

    [switch]$Force
)

$ErrorActionPreference = "Stop"
$script:ConsolePalette = $null
$script:SkipFinalClear = $false

function Show-CrtBanner {
    $banner = @'
 __  __           _              _   _               _ 
|  \/  | __ _ ___| |_ ___ _ __  | \ | | ___ _ __ ___| |
| |\/| |/ _` / __| __/ _ \ '__| |  \| |/ _ \ '__/     |
| |  | | (_| \__ \ ||  __/ |    | |\  |  __/ | |  ()  |
|_|  |_|\__,_|___/\__\___|_|    |_| \_|\___|_|  \_____|

                    By Manoel Coelho
'@
    Write-Host $banner -ForegroundColor Green
}

function Set-CrtConsoleTheme {
    $raw = $Host.UI.RawUI
    $script:ConsolePalette = [pscustomobject]@{
        Foreground = $raw.ForegroundColor
        Background = $raw.BackgroundColor
    }
    $raw.BackgroundColor = 'Black'
    $raw.ForegroundColor = 'Green'
    $raw.WindowTitle   = "MASTER NERD : CRT OPS"
    Clear-Host
    Show-CrtBanner
}

function Reset-CrtConsoleTheme {
    if ($script:ConsolePalette) {
        $Host.UI.RawUI.BackgroundColor = $script:ConsolePalette.Background
        $Host.UI.RawUI.ForegroundColor = $script:ConsolePalette.Foreground
        if (-not $script:SkipFinalClear) {
            Clear-Host
        }
    }
}

function Show-ProgressBar {
    param(
        [int]$Percent,
        [string]$Status = "Processando"
    )
    
    $barLength = 20
    $filled = [math]::Floor(($Percent / 100) * $barLength)
    $empty = $barLength - $filled
    
    $bar = ("[" + ("■" * $filled) + ("□" * $empty) + "]")
    $percentText = "{0,3}%" -f $Percent
    
    Write-Host "`r$bar $percentText $Status" -NoNewline -ForegroundColor Green
}

function Test-IsAdmin {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal $identity
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Ensure-Admin {
    if (-not (Test-IsAdmin)) {
        if (-not $Force) {
            throw "Execute este console como Administrador (ou use -Force para modo somente leitura)."
        }
        Write-Warning "Modo forçado: operações que exigem privilégio serão puladas."
    }
}

function Initialize-MasterFolders {
    $targets = @(
        'src/powershell/modules',
        'src/powershell/usb-toolkit',
        'assets/ui',
        'artifacts/isos',
        'docs'
    )

    foreach ($target in $targets) {
        $path = Join-Path -Path $PSScriptRoot -ChildPath "../$target"
        $resolved = Resolve-Path $path -ErrorAction SilentlyContinue
        if (-not $resolved) {
            New-Item -ItemType Directory -Path $path -Force | Out-Null
            Write-Host "[+] Spawned $target" -ForegroundColor Cyan
        } else {
            Write-Host "[=] Exists $target" -ForegroundColor DarkGray
        }
    }
}

function Invoke-SystemDiagnostics {
    Write-Host "[>] Capturando specs do host..." -ForegroundColor Yellow
    $secureBoot = try {
        Confirm-SecureBootUEFI -ErrorAction Stop
    } catch {
        if (Test-IsAdmin) {
            ("Indisponível: {0}" -f $_.Exception.Message)
        } else {
            "Indisponível (eleve o console para consultar)"
        }
    }

    $info = [pscustomobject]@{
        ComputerName = $env:COMPUTERNAME
        User         = $env:USERNAME
        OS           = (Get-CimInstance Win32_OperatingSystem).Caption
        Build        = (Get-CimInstance Win32_OperatingSystem).BuildNumber
        Uptime       = (Get-CimInstance Win32_OperatingSystem).LastBootUpTime
        PowerShell   = $PSVersionTable.PSVersion.ToString()
        SecureBoot   = $secureBoot
    }
    $info | Format-List

    $net = try {
        Get-NetAdapter -Physical -ErrorAction Stop | Where-Object Status -eq 'Up'
    } catch {
        Write-Warning "Falha ao enumerar adaptadores: $($_.Exception.Message)"
        @()
    }

    foreach ($adapter in $net) {
        Write-Host ("[NET] {0} {1} {2}" -f $adapter.Name,$adapter.InterfaceDescription,$adapter.MacAddress)
    }
}

function Invoke-UsbDryRun {
    Write-Host "[>] Modo dry-run para preparação de pendrive" -ForegroundColor Yellow
    $disks = Get-Disk | Where-Object BusType -eq 'USB'
    if (-not $disks) {
        Write-Warning "Nenhum disco USB detectado. Plugue o dispositivo antes de executar o modo ativo."
        return
    }

    foreach ($disk in $disks) {
        Write-Host ("[USB] #{0} {1}GB - Status:{2}" -f $disk.Number,[math]::Round($disk.Size/1GB,2),$disk.OperationalStatus)
    }

    Write-Host "[!] Dry-run evita qualquer instrução destrutiva. Para execução real implemente o pipeline em src/powershell/usb-toolkit." -ForegroundColor DarkYellow
}

function Invoke-UsbFormatWizard {
    Write-Host "[>] Formatação automática do pendrive (diskpart)" -ForegroundColor Yellow
    Ensure-Admin

    $formatSelected = $false

    while (-not $formatSelected) {
        Write-Host ""
        Write-Host "[DISK] Listando todos os discos disponíveis:" -ForegroundColor Cyan
        
        $allDisks = Get-Disk
        if (-not $allDisks) {
            Write-Warning "Nenhum disco detectado no sistema."
            return
        }

        $allDisks | ForEach-Object {
            $sizeGB = [math]::Round($_.Size / 1GB, 2)
            $busType = $_.BusType
            $highlight = if ($busType -eq 'USB') { 'Green' } else { 'Gray' }
            Write-Host ("  Disk {0} - {1}GB - {2} - BusType: {3} - Status: {4}" -f $_.Number, $sizeGB, $_.FriendlyName, $busType, $_.OperationalStatus) -ForegroundColor $highlight
        }

        $usbDisks = $allDisks | Where-Object BusType -eq 'USB'
        if ($usbDisks) {
            Write-Host ""
            Write-Host "[!] Discos USB destacados em verde acima." -ForegroundColor Yellow
        } else {
            Write-Host ""
            Write-Warning "Nenhum disco USB detectado. Você pode selecionar outro disco, mas confirme que é removível!"
        }

        Write-Host ""
        Write-Host "[R] Refrescar lista | [Número] Selecionar disco" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "==================== ATENÇÃO ====================" -ForegroundColor Red
        Write-Host "A formatação apagará TODOS OS DADOS do pendrive." -ForegroundColor Yellow
        Write-Host "Certifique-se de ter backup antes de continuar." -ForegroundColor Yellow
        Write-Host "================================================" -ForegroundColor Red
        Write-Host ""

        $diskNum = Read-Host "Digite o número do disco (ex: 1) ou R para refrescar"
        
        if ($diskNum -eq 'R' -or $diskNum -eq 'r') {
            Write-Host "[>] Refrescando lista de discos..." -ForegroundColor Yellow
            Start-Sleep -Milliseconds 800
            Clear-Host
            Write-Host "[>] Formatação automática do pendrive (diskpart)" -ForegroundColor Yellow
            continue
        }

        $targetDisk = $allDisks | Where-Object Number -eq $diskNum
        if (-not $targetDisk) {
            Write-Host "Disco '$diskNum' não encontrado. Tente novamente." -ForegroundColor Yellow
            Write-Host ""
            continue
        }

        $formatSelected = $true
    }
    
    if ($targetDisk.BusType -ne 'USB') {
        Write-Warning "ATENÇÃO: Disco selecionado NÃO é USB (BusType: $($targetDisk.BusType))"
        $confirmNonUsb = Read-Host "Tem certeza que deseja continuar? Digite 'SIM' em maiúsculas"
        if ($confirmNonUsb -ne 'SIM') {
            Write-Host "Operação cancelada." -ForegroundColor Yellow
            return
        }
    }

    $sizeGB = [math]::Round($targetDisk.Size / 1GB, 2)
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "Disco selecionado: Disk $diskNum - $sizeGB GB" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""

    # === PASSO 1: CLEAN ===
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Yellow
    Write-Host "║ PASSO 1: LIMPAR O DISCO (Clean)               ║" -ForegroundColor Yellow
    Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Yellow
    Write-Host "Isto removerá todas as partições do disco." -ForegroundColor Yellow
    Write-Host ""
    $cleanConfirm = Read-Host "Deseja prosseguir com CLEAN? (S/N)"
    if ($cleanConfirm -ne 'S' -and $cleanConfirm -ne 's') {
        Write-Host "Operação cancelada pelo usuário." -ForegroundColor Yellow
        return
    }

    Write-Host "[>] Executando CLEAN..." -ForegroundColor Yellow
    $cleanScript = @"
select disk $diskNum
clean
exit
"@

    $tempFile = [System.IO.Path]::GetTempFileName()
    $cleanScript | Set-Content -Path $tempFile -Encoding ASCII

    try {
        $output = diskpart /s $tempFile 2>&1
        $output | ForEach-Object { Write-Host $_ -ForegroundColor Gray }
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] CLEAN concluído com sucesso!" -ForegroundColor Green
        } else {
            throw "CLEAN falhou. Código: $LASTEXITCODE"
        }
    } finally {
        Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
    }

    # === PASSO 2: CREATE PARTITION ===
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Yellow
    Write-Host "║ PASSO 2: CRIAR PARTIÇÃO PRIMÁRIA               ║" -ForegroundColor Yellow
    Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Yellow
    Write-Host "[>] Criando partição primária..." -ForegroundColor Yellow

    $createScript = @"
select disk $diskNum
create partition primary
exit
"@

    $tempFile = [System.IO.Path]::GetTempFileName()
    $createScript | Set-Content -Path $tempFile -Encoding ASCII

    try {
        $output = diskpart /s $tempFile 2>&1
        $output | ForEach-Object { Write-Host $_ -ForegroundColor Gray }
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] Partição criada com sucesso!" -ForegroundColor Green
        } else {
            throw "CREATE PARTITION falhou. Código: $LASTEXITCODE"
        }
    } finally {
        Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
    }

    Start-Sleep -Milliseconds 800
    $partition = Get-Partition -DiskNumber $diskNum -ErrorAction SilentlyContinue | Sort-Object PartitionNumber -Descending | Select-Object -First 1
    if (-not $partition) {
        throw "Nenhuma partição encontrada no disco $diskNum após criação."
    }
    $partitionNumber = $partition.PartitionNumber
    Write-Host ("[>] Partição ativa detectada: #{0}" -f $partitionNumber) -ForegroundColor Yellow

    # === PASSO 3: SELECIONAR FILE SYSTEM ===
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Yellow
    Write-Host "║ PASSO 3: SELECIONAR SISTEMA DE ARQUIVOS        ║" -ForegroundColor Yellow
    Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "[1] exFAT   (Compatibilidade universal, até 4GB por arquivo)" -ForegroundColor Cyan
    Write-Host "[2] NTFS    (Windows nativo, sem limite de tamanho de arquivo)" -ForegroundColor Cyan
    Write-Host "[3] FAT32   (Compatibilidade máxima, limite 4GB por arquivo)" -ForegroundColor Cyan
    Write-Host ""

    $fsChoice = Read-Host "Selecione o sistema de arquivos (1/2/3)"
    
    $fileSystem = switch ($fsChoice) {
        "1" { "exfat" }
        "2" { "ntfs" }
        "3" { "fat32" }
        default {
            Write-Host "Opção inválida. Usando NTFS como padrão." -ForegroundColor Yellow
            "ntfs"
        }
    }

    Write-Host "[>] Formatando com $fileSystem..." -ForegroundColor Yellow
    Write-Host ""

    # === PASSO 4: FORMAT ===
    $formatScript = @"
select disk $diskNum
select partition $partitionNumber
format fs=$fileSystem quick
assign
exit
"@

    $tempFile = [System.IO.Path]::GetTempFileName()
    $formatScript | Set-Content -Path $tempFile -Encoding ASCII

    try {
        $job = Start-Job -ScriptBlock {
            param($tempFile)
            diskpart /s $tempFile 2>&1
        } -ArgumentList $tempFile

        $lastPercent = 0
        Show-ProgressBar -Percent 0 -Status "Iniciando formatação..."
        Start-Sleep -Milliseconds 500

        while ($job.State -eq 'Running') {
            $output = Receive-Job -Job $job
            
            foreach ($line in $output) {
                if ($line -match '(\d+)\s+por\s+cento\s+conclu[ií]do') {
                    $percent = [int]$matches[1]
                    if ($percent -ne $lastPercent) {
                        Show-ProgressBar -Percent $percent -Status "Formatando..."
                        $lastPercent = $percent
                    }
                }
            }
            
            Start-Sleep -Milliseconds 100
        }

        $finalOutput = Receive-Job -Job $job
        Remove-Job -Job $job -Force

        Show-ProgressBar -Percent 100 -Status "Concluído!"
        Write-Host ""
        Write-Host ""

        if ($LASTEXITCODE -eq 0 -or ($finalOutput -match 'formatou com êxito')) {
            Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Green
            Write-Host "║ [OK] FORMATAÇÃO CONCLUÍDA COM SUCESSO!         ║" -ForegroundColor Green
            Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Green
        } else {
            throw "FORMAT falhou. Verifique o output acima."
        }
    } finally {
        Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
    }
}

function Invoke-Menu {
    param(
        [switch]$Preview
    )
    $options = @(
        @{ Key = '1'; Name = 'Formatar Pendrive'; Handler = { Invoke-UsbFormatWizard } },
        @{ Key = '2'; Name = 'Microsoft-Activation-Scripts'; Handler = { 
            Write-Host "[>] Executando Microsoft-Activation-Scripts..." -ForegroundColor Yellow
            Write-Host ""
            irm https://get.activated.win | iex
        } },
        @{ Key = '3'; Name = 'Criar Pendrive Bootavel'; Handler = { Invoke-UsbDryRun } },
        @{ Key = 'Q'; Name = 'Sair'; Handler = { return } }
    )

    while ($true) {
        Write-Host ""; Write-Host "=== MENU MASTER NERD ===" -ForegroundColor Green
        foreach ($opt in $options) {
            Write-Host ("[{0}] {1}" -f $opt.Key,$opt.Name)
        }
        if ($Preview) { break }
        $choice = Read-Host "Selecione"
        $selected = $options | Where-Object Key -eq ($choice.ToUpper())
        if ($selected) {
            if ($selected.Key -eq 'Q') { break }
            & $selected.Handler
        } else {
            Write-Warning "Opção inválida"
        }
    }
}

try {
    Set-CrtConsoleTheme
    switch ($Action) {
        'Setup'       { Ensure-Admin; Initialize-MasterFolders }
        'Diagnostics' { Invoke-SystemDiagnostics }
        'UsbDryRun'   { Invoke-UsbDryRun }
        'All'         {
            Ensure-Admin
            Initialize-MasterFolders
            Invoke-SystemDiagnostics
            Invoke-UsbDryRun
        }
        'MenuPreview' {
            $script:SkipFinalClear = $true
            Invoke-Menu -Preview
        }
        default       { Invoke-Menu }
    }
}
catch {
    Write-Error $_
}
finally {
    Reset-CrtConsoleTheme
}
