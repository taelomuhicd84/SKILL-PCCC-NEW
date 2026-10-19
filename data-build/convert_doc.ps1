# Chuyển các bảng đối chiếu .doc (Word 97-2003) sang .docx bằng Word COM để build_data.py đọc được.
# Không sửa thư mục gốc: file .docx ghi vào data-build/doc_converted/.
# Dùng: powershell -ExecutionPolicy Bypass -File data-build\convert_doc.ps1 [thu_muc_bang]
param([string]$Src = '')
if (-not $Src) { $Src = (Get-ChildItem -LiteralPath 'D:\$.4. QC - TCVN' -Directory | Where-Object { $_.Name -like 'B*1' } | Select-Object -First 1).FullName }
$out = Join-Path $PSScriptRoot 'doc_converted'
New-Item -ItemType Directory -Force $out | Out-Null
$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
  Get-ChildItem -LiteralPath $Src -Filter *.doc | Where-Object { $_.Extension -eq '.doc' -and -not $_.Name.StartsWith('~$') } | ForEach-Object {
    $dst = Join-Path $out ($_.BaseName + '.docx')
    if (Test-Path -LiteralPath $dst) { return }
    $d = $word.Documents.Open($_.FullName, $false, $true)
    $d.SaveAs2([string]$dst, 16)  # 16 = wdFormatDocumentDefault (.docx)
    $d.Close($false)
    Write-Output "da chuyen: $($_.Name)"
  }
} finally { $word.Quit() }
