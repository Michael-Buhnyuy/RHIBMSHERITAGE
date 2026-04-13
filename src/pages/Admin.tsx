const Admin = () => (
  <div style={{ maxWidth: 900, margin: '2rem auto', padding: 20, textAlign: 'center' }}>
    <h1>🛠️ Admin Panel</h1>
    <p style={{ color: '#666', fontSize: '1.1em' }}>
      Please use <strong>AdminPage.tsx</strong> for creating documentary posts.
    </p>
    <p style={{ color: '#888', marginTop: '2rem' }}>
      New uploads now save full public URLs in correct <code>ImageItem[]</code> format 
      to match Documentary frontend expectations.
    </p>
  </div>
);

export default Admin;

