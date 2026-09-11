$toolsDir = "C:\Users\Dell\.tools"
if (!(Test-Path $toolsDir)) {
    New-Item -ItemType Directory -Force -Path $toolsDir | Out-Null
}

# 1. Setup Node.js if not present
$nodeExe = Join-Path $toolsDir "node\node.exe"
if (!(Test-Path $nodeExe)) {
    Write-Host "Downloading Node.js standalone zip..."
    $nodeZip = Join-Path $toolsDir "node.zip"
    $nodeUrl = "https://nodejs.org/dist/v20.18.0/node-v20.18.0-win-x64.zip"
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeZip -UseBasicParsing
    Write-Host "Extracting Node.js..."
    Expand-Archive -Path $nodeZip -DestinationPath $toolsDir -Force
    if (Test-Path (Join-Path $toolsDir "node-v20.18.0-win-x64")) {
        Move-Item -Path (Join-Path $toolsDir "node-v20.18.0-win-x64") -Destination (Join-Path $toolsDir "node") -Force
    }
    Remove-Item $nodeZip -Force
}

# 2. Setup Python standalone / embedded if not present
$pythonExe = Join-Path $toolsDir "python\python.exe"
if (!(Test-Path $pythonExe)) {
    Write-Host "Downloading Python standalone..."
    # Download standalone python release or python installer
    $pyZip = Join-Path $toolsDir "python.zip"
    $pyUrl = "https://github.com/astral-sh/python-build-standalone/releases/download/20241016/cpython-3.11.10+20241016-x86_64-pc-windows-msvc-shared-install_only.tar.gz"
    # Alternative: python embedded from python.org or standalone release
    try {
        Invoke-WebRequest -Uri "https://www.python.org/ftp/python/3.11.9/python-3.11.9-embed-amd64.zip" -OutFile $pyZip -UseBasicParsing
        Expand-Archive -Path $pyZip -DestinationPath (Join-Path $toolsDir "python") -Force
        Remove-Item $pyZip -Force
        
        # Download get-pip.py
        $pipPy = Join-Path $toolsDir "python\get-pip.py"
        Invoke-WebRequest -Uri "https://bootstrap.pypa.io/get-pip.py" -OutFile $pipPy -UseBasicParsing
        
        # Enable site-packages in python311._pth
        $pthFile = Join-Path $toolsDir "python\python311._pth"
        if (Test-Path $pthFile) {
            $pthContent = Get-Content $pthFile
            $pthContent = $pthContent -replace "#import site", "import site"
            Set-Content -Path $pthFile -Value $pthContent
        }
        
        & (Join-Path $toolsDir "python\python.exe") (Join-Path $toolsDir "python\get-pip.py") --no-warn-script-location
    } catch {
        Write-Host "Error setting up embedded python: $_"
    }
}

Write-Host "Tool Verification:"
if (Test-Path $nodeExe) {
    & $nodeExe --version
}
if (Test-Path $pythonExe) {
    & $pythonExe --version
}
