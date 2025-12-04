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

    $scriptPath = Join-Path $PSScriptRoot "usb-toolkit\Format-UsbDrive.ps1"
    if (-not (Test-Path $scriptPath)) {
        Write-Warning "Script de formatação não encontrado em: $scriptPath"
        Write-Host "[!] Clone o repositório completo ou baixe Format-UsbDrive.ps1 manualmente." -ForegroundColor Yellow
        return
    }

    & $scriptPath
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
