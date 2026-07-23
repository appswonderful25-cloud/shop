$uri = "http://localhost:1337/api"
$items = '[{"title":"Item 1","price":100,"quantity":1}]'

# Orders
Write-Host "=== Seeding Orders ==="
$orders = @(
  @{data=@{customerName="Omar Khaled";emailCustomer="omar@test.com";dateOrder="2026-03-10T09:15:00.000Z";statusOrder="delivered";totalPrice=89.50;customerPhone="+970593333333";customerAddress="Hebron";orderItems=@(@{title="Shoes";price=89.50;quantity=1})}},
  @{data=@{customerName="Lina Mahmoud";emailCustomer="lina@test.com";dateOrder="2026-04-05T16:00:00.000Z";statusOrder="inTransit";totalPrice=450.00;customerPhone="+970594444444";customerAddress="Jericho";orderItems=@(@{title="Laptop";price=450;quantity=1})}},
  @{data=@{customerName="Yazan Sami";emailCustomer="yazan@test.com";dateOrder="2026-05-12T11:45:00.000Z";statusOrder="delivered";totalPrice=175.25;customerPhone="+970595555555";customerAddress="Bethlehem";orderItems=@(@{title="Headphones";price=75.25;quantity=1};@{title="Case";price=100;quantity=1})}},
  @{data=@{customerName="Nour Ahmad";emailCustomer="nour@test.com";dateOrder="2026-06-18T08:20:00.000Z";statusOrder="delivered";totalPrice=320.00;customerPhone="+970596666666";customerAddress="Jenin";orderItems=@(@{title="Tablet";price=320;quantity=1})}},
  @{data=@{customerName="Rami Tarek";emailCustomer="rami@test.com";dateOrder="2026-07-01T13:10:00.000Z";statusOrder="failed";totalPrice=599.99;customerPhone="+970597777777";customerAddress="Tulkarm";orderItems=@(@{title="Phone";price=599.99;quantity=1})}},
  @{data=@{customerName="Dana Rami";emailCustomer="dana@test.com";dateOrder="2026-07-05T17:30:00.000Z";statusOrder="inTransit";totalPrice=125.00;customerPhone="+970598888888";customerAddress="Qalqilya";orderItems=@(@{title="Bag";price=125;quantity=1})}},
  @{data=@{customerName="Hadi Bassam";emailCustomer="hadi@test.com";dateOrder="2026-07-10T10:00:00.000Z";statusOrder="delivered";totalPrice=850.00;customerPhone="+970599999999";customerAddress="Ramallah";orderItems=@(@{title="Camera";price=850;quantity=1})}},
  @{data=@{customerName="Mona Sami";emailCustomer="mona@test.com";dateOrder="2026-07-15T15:45:00.000Z";statusOrder="delivered";totalPrice=67.80;customerPhone="+970590000000";customerAddress="Hebron";orderItems=@(@{title="Socks";price=17.80;quantity=2};@{title="Cap";price=32.20;quantity=1})}},
  @{data=@{customerName="Fadi Adel";emailCustomer="fadi@test.com";dateOrder="2026-07-18T12:00:00.000Z";statusOrder="inTransit";totalPrice=210.00;customerPhone="+970591234001";customerAddress="Ramallah";orderItems=@(@{title="Watch";price=210;quantity=1})}},
  @{data=@{customerName="Rania Husam";emailCustomer="rania@test.com";dateOrder="2026-07-20T09:30:00.000Z";statusOrder="delivered";totalPrice=399.99;customerPhone="+970591234002";customerAddress="Nablus";orderItems=@(@{title="Sneakers";price=399.99;quantity=1})}},
  @{data=@{customerName="Kareem Walid";emailCustomer="kareem@test.com";dateOrder="2026-07-21T14:15:00.000Z";statusOrder="failed";totalPrice=45.00;customerPhone="+970591234003";customerAddress="Hebron";orderItems=@(@{title="T-Shirt";price=25;quantity=2})}},
  @{data=@{customerName="Amal Zaid";emailCustomer="amal@test.com";dateOrder="2026-07-22T08:00:00.000Z";statusOrder="inTransit";totalPrice=180.50;customerPhone="+970591234004";customerAddress="Bethlehem";orderItems=@(@{title="Jacket";price=180.50;quantity=1})}}
)

foreach ($o in $orders) {
  $json = $o | ConvertTo-Json -Depth 5
  try {
    Invoke-RestMethod -Uri "$uri/orders" -Method POST -Body $json -ContentType "application/json" | Out-Null
    Write-Host "Order: $($o.data.customerName) OK"
  } catch { Write-Host "Order: $($o.data.customerName) FAIL" }
}

# Returns
Write-Host "`n=== Seeding Returns ==="
$returns = @(
  @{data=@{statusReturn="pending";reason="Product arrived damaged, need replacement"}},
  @{data=@{statusReturn="approved";reason="Wrong size received, requesting exchange"}},
  @{data=@{statusReturn="rejected";reason="Changed mind after 30 days return policy"}},
  @{data=@{statusReturn="pending";reason="Product not as described on website"}},
  @{data=@{statusReturn="approved";reason="Defective product, full refund requested"}},
  @{data=@{statusReturn="pending";reason="Missing parts from the package"}}
)

foreach ($r in $returns) {
  $json = $r | ConvertTo-Json -Depth 5
  try {
    Invoke-RestMethod -Uri "$uri/returns" -Method POST -Body $json -ContentType "application/json" | Out-Null
    Write-Host "Return: $($r.data.reason.Substring(0,30))... OK"
  } catch { Write-Host "Return FAIL" }
}

Write-Host "`nDone!"
$ordersCount = (Invoke-RestMethod -Uri "$uri/orders" -Method GET).data.Count
$returnsCount = (Invoke-RestMethod -Uri "$uri/returns" -Method GET).data.Count
Write-Host "Orders: $ordersCount | Returns: $returnsCount"
