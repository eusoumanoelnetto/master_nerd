# Master Nerd Bootstrap Redirector
# Short URL: https://get.masternerd.win (configure DNS/hosting to point here)

$script = Invoke-RestMethod 'https://raw.githubusercontent.com/eusoumanoelnetto/master_nerd/master/src/powershell/MasterNerd.Bootstrap.ps1'
Invoke-Expression $script
