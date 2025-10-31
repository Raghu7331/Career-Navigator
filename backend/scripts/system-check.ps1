# Career Navigator Full System Check
Write-Host "`n=== CAREER NAVIGATOR SYSTEM CHECK ===" -ForegroundColor Cyan
Write-Host ""

$passedTests = 0
$totalTests = 0

# Test 1: Backend Server
Write-Host "🔍 Testing Backend Server..." -ForegroundColor Yellow
$totalTests++
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get -TimeoutSec 3
    Write-Host "✅ Backend Server: RUNNING on port 5000" -ForegroundColor Green
    $passedTests++
} catch {
    Write-Host "❌ Backend Server: NOT RUNNING" -ForegroundColor Red
}

# Test 2: Frontend Server
Write-Host "🔍 Testing Frontend Server..." -ForegroundColor Yellow
$totalTests++
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:5173" -Method Get -TimeoutSec 3 -UseBasicParsing
    Write-Host "✅ Frontend: RUNNING on port 5173" -ForegroundColor Green
    $passedTests++
} catch {
    Write-Host "❌ Frontend: NOT RUNNING" -ForegroundColor Red
}

# Test 3: MongoDB
Write-Host "🔍 Testing MongoDB..." -ForegroundColor Yellow
$totalTests++
$mongoProcess = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
if ($mongoProcess) {
    Write-Host "✅ MongoDB: RUNNING (PID: $($mongoProcess.Id))" -ForegroundColor Green
    $passedTests++
} else {
    Write-Host "❌ MongoDB: NOT RUNNING" -ForegroundColor Red
}

# Test 4: Admin Authentication
Write-Host "🔍 Testing Admin Authentication..." -ForegroundColor Yellow
$totalTests++
try {
    $body = @{
        email = "admin@careernavigator.com"
        password = "SecureAdmin2025!"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/login" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 3
    
    if ($loginResponse.success -and $loginResponse.data.token) {
        Write-Host "✅ Admin Authentication: WORKING" -ForegroundColor Green
        $adminToken = $loginResponse.data.token
        $passedTests++
    } else {
        Write-Host "❌ Admin Authentication: FAILED" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Admin Authentication: ERROR - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Admin Stats (Database Connection)
Write-Host "🔍 Testing Database Connection..." -ForegroundColor Yellow
$totalTests++
try {
    $headers = @{
        "Authorization" = "Bearer $adminToken"
    }
    $stats = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/stats" -Method Get -Headers $headers -TimeoutSec 3
    $users = $stats.totalUsers
    $jobs = $stats.totalJobs
    Write-Host "[OK] Database: CONNECTED ($users users, $jobs jobs)" -ForegroundColor Green
    $passedTests++
} catch {
    Write-Host "[FAIL] Database: CONNECTION FAILED" -ForegroundColor Red
}

# Test 6: Jobs API
Write-Host "🔍 Testing Jobs API..." -ForegroundColor Yellow
$totalTests++
try {
    $jobs = Invoke-RestMethod -Uri "http://localhost:5000/api/jobs" -Method Get -TimeoutSec 3
    Write-Host "✅ Jobs API: WORKING" -ForegroundColor Green
    $passedTests++
} catch {
    Write-Host "❌ Jobs API: FAILED" -ForegroundColor Red
}

# Test 7: Email API
Write-Host "🔍 Testing Email System..." -ForegroundColor Yellow
$totalTests++
try {
    $headers = @{
        "Authorization" = "Bearer $adminToken"
    }
    $emailStats = Invoke-RestMethod -Uri "http://localhost:5000/api/enhanced-email/stats" -Method Get -Headers $headers -TimeoutSec 3
    Write-Host "✅ Email System: WORKING (Total: $($emailStats.totalEmails), Sent: $($emailStats.sentEmails))" -ForegroundColor Green
    $passedTests++
} catch {
    Write-Host "❌ Email System: FAILED" -ForegroundColor Red
}

# Test 8: Messages API
Write-Host "🔍 Testing Messages API..." -ForegroundColor Yellow
$totalTests++
try {
    $headers = @{
        "Authorization" = "Bearer $adminToken"
    }
    $messages = Invoke-RestMethod -Uri "http://localhost:5000/api/messages/sent" -Method Get -Headers $headers -TimeoutSec 3
    Write-Host "✅ Messages API: WORKING" -ForegroundColor Green
    $passedTests++
} catch {
    Write-Host "❌ Messages API: FAILED" -ForegroundColor Red
}

# Test 9: Recommendations API
Write-Host "🔍 Testing Recommendations API..." -ForegroundColor Yellow
$totalTests++
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/recommendations" -Method Get -TimeoutSec 3 -SkipHttpErrorCheck
    if ($response.StatusCode -eq 401 -or $response.StatusCode -eq 200) {
        Write-Host "✅ Recommendations API: WORKING" -ForegroundColor Green
        $passedTests++
    } else {
        Write-Host "❌ Recommendations API: UNEXPECTED RESPONSE" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Recommendations API: FAILED" -ForegroundColor Red
}

# Test 10: Upload API
Write-Host "🔍 Testing Upload API..." -ForegroundColor Yellow
$totalTests++
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/upload/my" -Method Get -TimeoutSec 3 -SkipHttpErrorCheck
    if ($response.StatusCode -eq 401 -or $response.StatusCode -eq 200) {
        Write-Host "✅ Upload API: WORKING" -ForegroundColor Green
        $passedTests++
    } else {
        Write-Host "❌ Upload API: UNEXPECTED RESPONSE" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Upload API: FAILED" -ForegroundColor Red
}

# Calculate percentage
$percentage = [math]::Round(($passedTests / $totalTests) * 100)

# Display results
Write-Host "`n$('=' * 60)" -ForegroundColor Cyan
Write-Host "📊 TEST RESULTS: $passedTests/$totalTests PASSED ($percentage%)" -ForegroundColor Cyan
Write-Host "$('=' * 60)" -ForegroundColor Cyan

if ($percentage -eq 100) {
    Write-Host "`n🎉 ALL SYSTEMS OPERATIONAL - 100% WORKING!" -ForegroundColor Green
    Write-Host ""
    Write-Host "   🌐 Frontend:  http://localhost:5173" -ForegroundColor Cyan
    Write-Host "   🔧 Backend:   http://localhost:5000" -ForegroundColor Cyan
    Write-Host "   🗄️  Database:  MongoDB (career_navigator)" -ForegroundColor Cyan
    Write-Host "   👤 Admin:     admin@careernavigator.com" -ForegroundColor Cyan
    Write-Host ""
} elseif ($percentage -ge 80) {
    Write-Host "`n✅ SYSTEM MOSTLY OPERATIONAL - $percentage% WORKING" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "`n⚠️  SYSTEM NEEDS ATTENTION - $percentage% OPERATIONAL" -ForegroundColor Red
    Write-Host ""
}
