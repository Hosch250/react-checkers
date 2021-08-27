import './Board.css';
import wp from './Assets/WhitePiece.svg'
import bp from './Assets/BlackPiece.svg'
import wk from './Assets/WhiteKing.svg'
import bk from './Assets/BlackKing.svg'

enum Color {
    White = 'white', Black = 'black'
}

enum PieceEnum {
    WhitePiece, BlackPiece, WhiteKing, BlackKing
}

function Board() {
  return (
    <div className="Board">
        <div className="row">
            <Square color={Color.White} />
            <Square color={Color.Black} />
            <Square color={Color.White} />
            <Square color={Color.Black} />
            <Square color={Color.White} />
            <Square color={Color.Black} />
            <Square color={Color.White} />
            <Square color={Color.Black} />
        </div>
        <div className="row">
            <Square color={Color.Black} />
            <Square color={Color.White} />
            <Square color={Color.Black} />
            <Square color={Color.White} />
            <Square color={Color.Black} />
            <Square color={Color.White} />
            <Square color={Color.Black} />
            <Square color={Color.White} />
        </div>
        <div className="row">
            <Square color={Color.White} />
            <Square color={Color.Black} />
            <Square color={Color.White} />
            <Square color={Color.Black} />
            <Square color={Color.White} />
            <Square color={Color.Black} />
            <Square color={Color.White} />
            <Square color={Color.Black} />
        </div>
        <div className="row">
            <Square color={Color.Black} />
            <Square color={Color.White} />
            <Square color={Color.Black} />
            <Square color={Color.White} />
            <Square color={Color.Black} />
            <Square color={Color.White} />
            <Square color={Color.Black} />
            <Square color={Color.White} />
        </div>
        <div className="row">
            <Square color={Color.White} />
            <Square color={Color.Black} />
            <Square color={Color.White} />
            <Square color={Color.Black} />
            <Square color={Color.White} />
            <Square color={Color.Black} />
            <Square color={Color.White} />
            <Square color={Color.Black} />
        </div>
        <div className="row">
            <Square color={Color.Black} />
            <Square color={Color.White} />
            <Square color={Color.Black} />
            <Square color={Color.White} />
            <Square color={Color.Black} />
            <Square color={Color.White} />
            <Square color={Color.Black} />
            <Square color={Color.White} />
        </div>
        <div className="row">
            <Square color={Color.White} />
            <Square color={Color.Black} />
            <Square color={Color.White} />
            <Square color={Color.Black} />
            <Square color={Color.White} />
            <Square color={Color.Black} />
            <Square color={Color.White} />
            <Square color={Color.Black} />
        </div>
        <div className="row">
            <Square color={Color.Black} />
            <Square color={Color.White} />
            <Square color={Color.Black} />
            <Square color={Color.White} />
            <Square color={Color.Black} />
            <Square color={Color.White} />
            <Square color={Color.Black} />
            <Square color={Color.White} />
        </div>
    </div>
  );
}

export default Board;

function Square({ color, piece }: { color: Color, piece?: PieceEnum }) {
    const styles = {backgroundColor: color, height: 50, width: 50, display: 'inline-block'};
    
    let domPiece = piece ? <Piece piece={piece} /> : null;
    return (
        <div style={styles}>
            {domPiece}
        </div>
    );
}

function Piece({ piece }: { piece: PieceEnum }) {
    let domPiece = null;
    switch (piece) {
        case PieceEnum.WhitePiece:
            domPiece = <img src={wp} style={{padding: 5}} />
            break;
        case PieceEnum.BlackPiece:
            domPiece = <img src={bp} style={{padding: 5}} />
            break;
        case PieceEnum.WhiteKing:
            domPiece = <img src={wk} style={{padding: 5}} />
            break;
        case PieceEnum.BlackKing:
            domPiece = <img src={bk} style={{padding: 5}} />
            break;
    }
    return domPiece;
}