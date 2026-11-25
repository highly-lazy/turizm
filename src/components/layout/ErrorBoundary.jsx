import { Component } from 'react';
import { Button, Panel } from '@/components/ui';

/** Kutilmagan xatoda oq ekran o‘rniga tushunarli oyna; natijalar brauzerda saqlangan bo‘ladi. */
export class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="focus">
        <Panel title="Sahifada xato yuz berdi" hint="Natijalar shu brauzerda saqlangan. Bosh sahifadan davom eting.">
          <Button variant="primary" onClick={() => window.location.assign('/')}>Bosh sahifaga</Button>
        </Panel>
      </main>
    );
  }
}
