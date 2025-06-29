// import { useEffect, useState } from 'react';
import { useEffect, useState } from 'react';
import './App.css';

interface User {
    id: number;
    name: string;
    email: string;
}

function App() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.api.getUsers()
            .then((data: User[]) => setUsers(data))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="app-container">
            <h1>Importierte Nutzer</h1>

            {loading && <p>Lade Daten…</p>}

            {!loading && users.length === 0 && <p>Keine Nutzer gefunden.</p>}

            {!loading && users.length > 0 && (
                <ul className="user-list">
                    {users.map(user => (
                        <li key={user.id} className="user-item">
                            <strong>{user.name}</strong> <br />
                            <span>{user.email}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default App;
