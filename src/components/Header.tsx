import logo from "@/assets/zvizegwe-logo.png";

export const Header = () => {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Zvizegwe Farm" className="h-12" />
            <div>
              <h1 className="text-2xl font-bold text-primary">Zvizegwe Farm</h1>
              <p className="text-sm text-muted-foreground">Farm Management Dashboard</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Last Updated</p>
            <p className="text-sm font-medium text-foreground">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
