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
| |\/| |/ _` / __| __/ _ \ '__| |  \| |/ _ \ '__/   | |
| |  | | (_| \__ \ ||  __/ |    | |\  |  __/ | |  ()| |
|_|  |_|\__,_|___/\__\___|_|    |_| \_|\___|_|  \___|_|
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
    Write-Host "[>] Formatação guiada do pendrive" -ForegroundColor Yellow
    Ensure-Admin

    $usbDisks = Get-Disk | Where-Object BusType -eq 'USB'
    if (-not $usbDisks) {
        Write-Warning "Nenhum pendrive USB detectado. Conecte o dispositivo e tente novamente."
        return
    }

    Write-Host ""
    Write-Host "[USB] Discos removíveis detectados:" -ForegroundColor Cyan
    $usbDisks | ForEach-Object {
        $sizeGB = [math]::Round($_.Size / 1GB, 2)
        Write-Host ("  Disk {0} - {1}GB - {2} - Status: {3}" -f $_.Number, $sizeGB, $_.FriendlyName, $_.OperationalStatus)
    }

    Write-Host ""
    Write-Host "==================== ATENÇÃO ====================" -ForegroundColor Red
    Write-Host "A formatação apagará TODOS OS DADOS do pendrive." -ForegroundColor Yellow
    Write-Host "Certifique-se de ter backup antes de continuar." -ForegroundColor Yellow
    Write-Host "=================================================" -ForegroundColor Red
    Write-Host ""

    $diskNum = Read-Host "Digite o número do disco (ex: 1)"
    $targetDisk = $usbDisks | Where-Object Number -eq $diskNum
    if (-not $targetDisk) {
        throw "Disco $diskNum não encontrado ou não é USB."
    }

    $confirm1 = Read-Host "Digite o número do disco NOVAMENTE para confirmar"
    if ($confirm1 -ne $diskNum) {
        throw "Confirmação falhou. Operação cancelada."
    }

    $confirm2 = Read-Host "Digite 'FORMATAR' (em maiúsculas) para prosseguir"
    if ($confirm2 -ne "FORMATAR") {
        Write-Host "Operação cancelada pelo usuário." -ForegroundColor Yellow
        return
    }

    Write-Host ""
    Write-Host "Escolha o sistema de arquivos:" -ForegroundColor Cyan
    Write-Host "  [1] exFAT (recomendado - compatível com Windows/Mac/Linux)"
    Write-Host "  [2] NTFS (Windows nativo)"
    Write-Host "  [3] FAT32 (máximo 4GB por arquivo)"
    $fsChoice = Read-Host "Digite 1, 2 ou 3"

    $fs = switch ($fsChoice) {
        "1" { "exfat" }
        "2" { "ntfs" }
        "3" { "fat32" }
        default { "exfat" }
    }

    Write-Host "[>] Iniciando formatação do Disk $diskNum como $fs..." -ForegroundColor Cyan

    $diskpartScript = @"
select disk $diskNum
clean
create partition primary
format fs=$fs quick
assign
exit
"@

    $tempFile = [System.IO.Path]::GetTempFileName()
    $diskpartScript | Set-Content -Path $tempFile -Encoding ASCII

    try {
        Write-Host "[>] Executando diskpart..." -ForegroundColor Yellow
        $output = diskpart /s $tempFile 2>&1
        $output | ForEach-Object { Write-Host $_ }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] Formatação concluída com sucesso!" -ForegroundColor Green
        } else {
            throw "Diskpart retornou erro. Código: $LASTEXITCODE"
        }
    }
    finally {
        Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
    }
}

function Invoke-Menu {
    param(
        [switch]$Preview
    )
    $options = @(
        @{ Key = '1'; Name = 'Formatar Pendrive'; Handler = { Invoke-UsbFormatWizard } },
        @{ Key = '2'; Name = 'Microsoft-Activation-Scripts'; Handler = { Start-Process "https://github.com/massgravel/Microsoft-Activation-Scripts" } },
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
