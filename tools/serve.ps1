# Tiny static file server for local preview. No Node or Python needed.
# Usage:  powershell -ExecutionPolicy Bypass -File tools\serve.ps1 [-Port 5173]
# The site also works by simply opening index.html; this is only for testing over http.
param([int]$Port = 5173)

$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$types = @{
  '.html' = 'text/html; charset=utf-8'; '.css' = 'text/css; charset=utf-8'
  '.js' = 'application/javascript; charset=utf-8'; '.json' = 'application/json; charset=utf-8'
  '.svg' = 'image/svg+xml'; '.png' = 'image/png'; '.jpg' = 'image/jpeg'; '.ico' = 'image/x-icon'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Serving $root at http://localhost:$Port/  (Ctrl+C to stop)"

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart('/')
    if ($rel -eq '') { $rel = 'index.html' }
    $path = [IO.Path]::GetFullPath((Join-Path $root $rel))
    $res = $ctx.Response
    if ($path.StartsWith($root, [StringComparison]::OrdinalIgnoreCase) -and (Test-Path $path -PathType Leaf)) {
      $bytes = [IO.File]::ReadAllBytes($path)
      $ext = [IO.Path]::GetExtension($path).ToLower()
      $ct = $types[$ext]
      if (-not $ct) { $ct = 'application/octet-stream' }
      $res.ContentType = $ct
      $res.Headers.Add('Cache-Control', 'no-store')
      # a HEAD request has no body, and a browser may drop the connection mid-reply:
      # neither should stop the server
      try {
        if ($ctx.Request.HttpMethod -eq 'HEAD') { $res.ContentLength64 = $bytes.Length }
        else { $res.OutputStream.Write($bytes, 0, $bytes.Length) }
      } catch { }
    } else {
      $res.StatusCode = 404
    }
    try { $res.Close() } catch { }
  }
} finally {
  $listener.Stop()
}
