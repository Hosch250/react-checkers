import React from 'react';

export function MoveContextMenu({
  showContextMenu, setShowContextMenu,
}: {
  showContextMenu: {
    show: boolean;
    moveNumber?: number;
    fen?: string;
    x?: number;
    y?: number;
  };
  setShowContextMenu: React.Dispatch<React.SetStateAction<{ show: boolean; }>>;
}) {
  let toggle = (ev: MouseEvent) => {
    if (showContextMenu.show) {
      let target = ev.target as HTMLElement;
      if (!target.dataset['movenumber']) {
        setShowContextMenu({ show: false });
      }
    }
  };
  React.useEffect(() => {
    if (showContextMenu) {
      document.addEventListener('click', toggle);
      document.addEventListener('contextmenu', toggle);
    }
    return () => {
      document.removeEventListener('click', toggle);
      document.removeEventListener('contextmenu', toggle);
    };
  });

  let copyFen = () => {
    navigator.clipboard.writeText(showContextMenu.fen!);
  };

  return (
    <ul
      className={`dropdown-menu position-absolute ${showContextMenu.show ? 'd-block' : ''}`}
      style={{ top: showContextMenu.y, left: showContextMenu.x }}
    >
      <li>
        <button className="dropdown-item" onClick={copyFen}>
          Copy FEN
        </button>
      </li>
    </ul>
  );
}
