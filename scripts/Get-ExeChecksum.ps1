Param(
    [Parameter(Mandatory=$true)]
    [string]$Path
)

if (-not (Test-Path -LiteralPath $Path)) {
    Write-Error "Arquivo não encontrado: $Path"
    exit 1
}

$hash = Get-FileHash -Algorithm SHA256 -LiteralPath $Path
"Arquivo: $($hash.Path)"
"Algoritmo: $($hash.Algorithm)"
"SHA256: $($hash.Hash)"