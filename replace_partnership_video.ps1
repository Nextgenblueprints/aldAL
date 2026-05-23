$filePath = "docs/partnership-representation.html"
$content = Get-Content -Path $filePath -Raw

$videoTag = "<video autoplay muted loop playsinline preload=`"metadata`" class=`"w-100 h-100 objfit-cover objfit-center`"><source src=`"assets/services/svc-partnership.mp4`" type=`"video/mp4`" /></video>"
$pattern = "<img[^>]+src=`"[^`"]*Partnership-Representation-Services\.jpg`"[^>]*>"

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $pattern, $videoTag)

Set-Content -Path $filePath -Value $content -Encoding UTF8
Write-Output "Replacement complete."
