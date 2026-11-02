# Uso: armar.ps1 <composición> <video de entrada> <audio para el final> <salida>
param($id, $entrada, $audio, $fin)
$z = "M:\reel-v2\video\public\z"; New-Item -ItemType Directory -Force $z | Out-Null
$src = "$z\" + (Split-Path $entrada -Leaf)
& ffmpeg -v error -y -i $entrada -an -vf "fps=30" -c:v libx264 -crf 15 -g 15 -preset fast -threads 4 $src
Set-Location "M:\reel-v2\video"
& npx remotion bundle --out-dir=build
$tot = [int][math]::Round([double](& ffprobe -v error -show_entries format=duration -of csv=p=0 $src) * 30)
$dir = "M:\reel-v2\trabajo-noviembre\zoom\$id"; Remove-Item -Recurse -Force $dir -ErrorAction SilentlyContinue; New-Item -ItemType Directory -Force $dir | Out-Null
$lista = @(); $a = 0; $i = 0
while ($a -lt $tot) {
  $b = [math]::Min($a + 119, $tot - 1); $f = "$dir\t$($i.ToString('000')).mp4"
  for ($try = 0; $try -lt 3 -and -not (Test-Path $f); $try++) {
    & npx remotion render build $id $f "--frames=$a-$b" --muted --crf=18 --concurrency=2 --timeout=90000 --offthreadvideo-cache-size-in-bytes=200000000 --offthreadvideo-threads=1 --log=error
  }
  $lista += "file '$($f -replace '\\','/')'"; $a = $b + 1; $i++
}
$lista | Set-Content -Encoding ascii "$dir\lista.txt"
& ffmpeg -v error -y -f concat -safe 0 -i "$dir\lista.txt" -c copy "$dir.mp4"
& ffmpeg -v error -y -i "$dir.mp4" -i $audio -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -ar 48000 -movflags +faststart -shortest $fin
"listo $([math]::Round((Get-Item $fin).Length/1MB,1)) MiB"
