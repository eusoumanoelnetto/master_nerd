<#
.SYNOPSIS
    Formatação guiada e segura de pendrive via diskpart.
.DESCRIPTION
    Lista discos USB, solicita confirmação dupla e formata com filesystem escolhido.
    Baseado no tutorial TechTudo com proteção adicional contra seleção acidental.
#>
[CmdletBinding()]
param(
    [ValidateSet("exFAT","NTFS","FAT32")]
    [string]$FileSystem = "exFAT",

    [switch]$Force
)

$ErrorActionPreference = "Stop"

function Test-IsAdmin {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal $identity
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Get-UsbDisks {
    Get-Disk | Where-Object { $_.BusType -eq 'USB' }
}

function Show-DiskWarning {
    Write-Host ""
    Write-Host "==================== ATENÇÃO ====================" -ForegroundColor Red
    Write-Host "A formatação apagará TODOS OS DADOS do pendrive." -ForegroundColor Yellow
    Write-Host "Certifique-se de ter backup antes de continuar." -ForegroundColor Yellow
    Write-Host "=================================================" -ForegroundColor Red
    Write-Host ""
}

function Format-UsbDrive {
    param(
        [Parameter(Mandatory)]
        [int]$DiskNumber,
        [string]$FS = "exFAT"
    )

    # Traduz filesystem para formato diskpart
    $diskpartFS = switch ($FS) {
        "exFAT" { "exfat" }
        "NTFS"  { "ntfs" }
        "FAT32" { "fat32" }
        default { "exfat" }
    }

    Write-Host "[>] Iniciando formatação do Disk $DiskNumber como $FS..." -ForegroundColor Cyan

    # Script diskpart exatamente como no tutorial TechTudo
    $script = @"
select disk $DiskNumber
clean
create partition primary
format fs=$diskpartFS quick
assign
exit
"@

    $tempFile = [System.IO.Path]::GetTempFileName()
    $script | Set-Content -Path $tempFile -Encoding ASCII

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

# === Fluxo principal ===

if (-not (Test-IsAdmin)) {
    throw "Este script requer execução como Administrador."
}

Write-Host "=== FORMATAÇÃO DE PENDRIVE (TechTudo) ===" -ForegroundColor Green
Write-Host ""

$usbDisks = Get-UsbDisks
if (-not $usbDisks) {
    Write-Warning "Nenhum pendrive USB detectado. Conecte o dispositivo e tente novamente."
    return
}

Write-Host "[USB] Discos removíveis detectados:" -ForegroundColor Cyan
$usbDisks | ForEach-Object {
    $sizeGB = [math]::Round($_.Size / 1GB, 2)
    Write-Host ("  Disk {0} - {1}GB - {2} - Status: {3}" -f $_.Number, $sizeGB, $_.FriendlyName, $_.OperationalStatus)
}

Write-Host ""
$diskNum = Read-Host "Digite o número do disco (ex: 1)"

# Validação
$targetDisk = $usbDisks | Where-Object Number -eq $diskNum
if (-not $targetDisk) {
    throw "Disco $diskNum não encontrado ou não é USB."
}

# Confirmação dupla
Show-DiskWarning
$confirm1 = Read-Host "Digite o número do disco NOVAMENTE para confirmar"
if ($confirm1 -ne $diskNum) {
    throw "Confirmação falhou. Operação cancelada."
}

$confirm2 = Read-Host "Digite 'FORMATAR' (em maiúsculas) para prosseguir"
if ($confirm2 -ne "FORMATAR") {
    Write-Host "Operação cancelada pelo usuário." -ForegroundColor Yellow
    return
}

# Escolha do filesystem
Write-Host ""
Write-Host "Escolha o sistema de arquivos:" -ForegroundColor Cyan
Write-Host "  [1] exFAT (recomendado - compatível com Windows/Mac/Linux)"
Write-Host "  [2] NTFS (Windows nativo)"
Write-Host "  [3] FAT32 (máximo 4GB por arquivo)"
$fsChoice = Read-Host "Digite 1, 2 ou 3"

$FileSystem = switch ($fsChoice) {
    "1" { "exFAT" }
    "2" { "NTFS" }
    "3" { "FAT32" }
    default { "exFAT" }
}

# Executa formatação
Format-UsbDrive -DiskNumber $diskNum -FS $FileSystem
