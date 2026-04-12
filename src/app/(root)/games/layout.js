export default function GamesLayout({ children, modal }) {
    return (
        <div className="mx-auto p-4">
            {children}
            <h1>Modal below</h1>
            {modal}
        </div>
    );
}