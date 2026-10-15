<#
.SYNOPSIS
  Sincroniza los subsistemas de EDANOS desde el directorio de desarrollo
  hacia el monorepo open source (esta carpeta).

.DESCRIPTION
  Copia backend/, frontendpc/, edan1.2/, satos/, hero/ y los archivos
  raíz (README, LICENSE, CONTRIBUTING, AGENTS) desde el directorio de
  desarrollo hacia este repositorio, excluyendo siempre:
    - .git, node_modules, builds, .vscode, .idea, .expo, .kotlin
    - Archivos .env reales (se copian SOLO .env.example)
    - Logs, archivos comprimidos y artefactos locales

.USO
  .\sync.ps1            # sincroniza y hace git add
  .\sync.ps1 -NoGit     # solo copia, sin git add
#>

param(
	[string]$Source = 'D:\proyectos2025\pcmerida',
	[switch]$NoGit
)

$ErrorActionPreference = 'Stop'
$Dest = $PSScriptRoot

if (-not (Test-Path $Source)) {
	Write-Error "No se encontró el directorio origen: $Source"
	exit 1
}

# Carpetas de proyectos a sincronizar
$Proyectos = @('backend', 'frontendpc', 'edan1.2', 'satos', 'hero')

# Archivos raíz a sincronizar
$ArchivosRaiz = @('README.md', 'LICENSE', 'CONTRIBUTING.md', 'AGENTS.md')

# Exclusiones de carpetas (/XD) — recursivas
$ExcluirCarpetas = @(
	'.git',
	'node_modules',
	'.expo',
	'dist',
	'build',
	'web-build',
	'.next',
	'.vscode',
	'.idea',
	'.kotlin',
	'.metro-health-check*',
	'ios',
	'android'
)

# Exclusiones de archivos (/XF)
# NOTA: .env.example SÍ se copia (es la plantilla pública)
$ExcluirArchivos = @(
	'.env',
	'.env.local',
	'.env.production',
	'.env.development',
	'*.env',
	'*.log',
	'*.rar',
	'*.evn',
	'cookies.txt',
	'bot.qr.png',
	'*.qr.png',
	'*.tsbuildinfo',
	'.DS_Store'
)

Write-Host ''
Write-Host '=== EDANOS sync ===' -ForegroundColor Cyan
Write-Host "Origen: $Source"
Write-Host 'Destino: ' -NoNewline
Write-Host $Dest -ForegroundColor Yellow
Write-Host ''

$errores = @()

# --- 1. Sincronizar carpetas de proyectos ---
foreach ($p in $Proyectos) {
	$origenP = Join-Path $Source $p
	$destinoP = Join-Path $Dest $p

	if (-not (Test-Path $origenP)) {
		Write-Host "[AVISO] Proyecto no encontrado, se omite: $p" -ForegroundColor Yellow
		continue
	}

	Write-Host "[1/3] Copiando $p/ ..." -ForegroundColor White

	# /E = subcarpetas (incluye vacías) | /XF /XD = exclusiones
	# Sin /MIR para no borrar archivos extra del destino (READMEs overlay, etc.)
	robocopy $origenP $destinoP /E /XD $ExcluirCarpetas /XF $ExcluirArchivos /R:1 /W:1 /NP /NDL /NJH | Out-Null

	# robocopy: códigos 0-7 = éxito, >=8 = error
	if ($LASTEXITCODE -ge 8) {
		$errores += $p
		Write-Host "  ERROR robocopy (código $LASTEXITCODE)" -ForegroundColor Red
	}
	else {
		Write-Host '  OK' -ForegroundColor Green
	}
}

# --- 2. Sincronizar archivos raíz ---
Write-Host ''
Write-Host '[2/3] Copiando archivos raíz ...' -ForegroundColor White
foreach ($f in $ArchivosRaiz) {
	$origenF = Join-Path $Source $f
	if (Test-Path $origenF) {
		Copy-Item -Path $origenF -Destination (Join-Path $Dest $f) -Force
		Write-Host "  OK  $f" -ForegroundColor Green
	}
	else {
		Write-Host "  AVISO: no existe $f, se omite" -ForegroundColor Yellow
	}
}

# --- 3. Git add (opcional) ---
if (-not $NoGit) {
	Write-Host ''
	Write-Host '[3/3] git add -A ...' -ForegroundColor White
	if (Test-Path (Join-Path $Dest '.git')) {
		git -C $Dest add -A
		Write-Host 'Listo. Revisa con:  git -C' $Dest 'status --short' -ForegroundColor Cyan
	}
	else {
		Write-Host 'No hay repo .git en esta carpeta todavía (ejecuta git init).' -ForegroundColor Yellow
	}
}

Write-Host ''
if ($errores.Count -gt 0) {
	Write-Host ("Sincronización con ERRORES en: " + ($errores -join ', ')) -ForegroundColor Red
	exit 1
}
Write-Host '=== Sincronización completada ===' -ForegroundColor Green
