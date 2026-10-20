param (
    [string]$docxPath,
    [string]$outputPath
)

try {
    $tempDir = Join-Path $PSScriptRoot "temp_extract"
    if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
    New-Item -ItemType Directory -Path $tempDir | Out-Null

    # Copy docx to zip and extract
    $zipPath = Join-Path $tempDir "doc.zip"
    Copy-Item $docxPath $zipPath
    Expand-Archive -Path $zipPath -DestinationPath $tempDir -Force

    $xmlPath = Join-Path $tempDir "word\document.xml"
    if (Test-Path $xmlPath) {
        [xml]$xml = Get-Content $xmlPath
        $ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
        $ns.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
        
        $text = ($xml.SelectNodes("//w:t", $ns) | ForEach-Object { $_.InnerText }) -join " "
        $text | Out-File -FilePath $outputPath -Encoding utf8
        Write-Host "Success: Extracted to $outputPath"
    } else {
        Write-Error "Could not find word/document.xml"
    }
} catch {
    Write-Error $_.Exception.Message
} finally {
    if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
}
