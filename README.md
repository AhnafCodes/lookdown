# lookdown (experimental)

 lookdown  temporarily perisist localStorage & sessionStorage. 
 Goal is to delay JSON.Stringify and avoid JSON.Parse. 
 
 - currently uses 'beforeunload' event but future goal is to augment it using something like BatteryAPI(now deprecated in Firefox).
