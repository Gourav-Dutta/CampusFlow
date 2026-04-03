export default function Admin() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-6 text-xl font-bold border-b">
          Admin Panel
        </div>

        <nav className="p-4 space-y-3">
          <a href="#" className="block px-3 py-2 rounded-lg hover:bg-gray-100">
            Dashboard
          </a>
          <a href="#" className="block px-3 py-2 rounded-lg hover:bg-gray-100">
            Users
          </a>
          <a href="#" className="block px-3 py-2 rounded-lg hover:bg-gray-100">
            Products
          </a>
          <a href="#" className="block px-3 py-2 rounded-lg hover:bg-gray-100">
            Orders
          </a>
          <a href="#" className="block px-3 py-2 rounded-lg hover:bg-gray-100">
            Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Dashboard</h1>

          <div className="flex items-center gap-4">
            <span className="text-gray-600">Hi, Admin</span>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

            <div className="bg-white p-5 rounded-xl shadow">
              <h3 className="text-gray-500 text-sm">Total Users</h3>
              <p className="text-2xl font-bold mt-2">1,245</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <h3 className="text-gray-500 text-sm">Orders</h3>
              <p className="text-2xl font-bold mt-2">320</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <h3 className="text-gray-500 text-sm">Revenue</h3>
              <p className="text-2xl font-bold mt-2">₹45,000</p>
            </div>

          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>

            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-sm border-b">
                  <th className="pb-2">Order ID</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b">
                  <td className="py-2">#001</td>
                  <td>John Doe</td>
                  <td>₹500</td>
                  <td className="text-green-600">Completed</td>
                </tr>

                <tr className="border-b">
                  <td className="py-2">#002</td>
                  <td>Jane Smith</td>
                  <td>₹1200</td>
                  <td className="text-yellow-600">Pending</td>
                </tr>

                <tr>
                  <td className="py-2">#003</td>
                  <td>Alex</td>
                  <td>₹750</td>
                  <td className="text-red-600">Cancelled</td>
                </tr>
              </tbody>
            </table>
          </div>

        </main>
      </div>
    </div>
  );
}