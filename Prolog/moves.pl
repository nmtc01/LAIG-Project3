%INCLUDES
:-use_module(library(lists)).

%GET COLOR TILE 
check_tile(Piece,NewPiece):-
    Res is Piece mod 10,
    Res == 0,
    !, 
    NewPiece is 0,
    NewPiece == 0.

check_tile(_,NewPiece):-
    NewPiece is 1,
    NewPiece == 1.
 
%SET PIECE ON THE BOARD
set_piece(Line,Column,Piece,BoardIn,BoardOut):-
    set_in_line(Line,Column,Piece,BoardIn,BoardOut).

set_in_line(1,Column,Piece,[Line|More], [NewLine|More]):-
    set_in_column(Column,Piece, Line,NewLine).

set_in_line(N,Column,Piece,[Line|Rest],[Line|NewRest]):-
    N>1,
    Next is N-1, 
    set_in_line(Next,Column,Piece,Rest,NewRest).

set_in_column(1,Piece,[_|More],[Piece|More]).
set_in_column(N,Piece,[X|Rest],[X|NewRest]):-
    N>1,
    Next is N-1,
    set_in_column(Next,Piece,Rest,NewRest).

%GET PIECE ON THOSE COORDS
get_piece(LineFrom,ColumnFrom,Piece,BoardIn):-
    get_line(LineFrom,ColumnFrom,Piece,BoardIn).

get_line(1,Column,Piece,[Line|_]):-
    get_column(Column,Piece,Line).
get_line(N,Column,Piece,[_|Rest]):-
    N>1,
    Next is N-1, 
    get_line(Next,Column,Piece,Rest).

get_column(1,Res,[Res|_]).
get_column(N,Piece,[_|Rest]):-
    N>1,
    Next is N-1,
    get_column(Next,Piece,Rest).

%CREATE NEW PIECE
new_piece(TileTo,PieceFrom,Piece):-
    TileTo == 0, 
    !,
    new_piece_black_tile(PieceFrom,Piece).
new_piece(_,PieceFrom,Piece):-
    new_piece_white_tile(PieceFrom,Piece).

new_piece_black_tile(PieceFrom,Piece):-
    Aux is PieceFrom mod 10,
    Aux == 0,
    !,
    Piece is PieceFrom,
    Piece == PieceFrom.
new_piece_black_tile(PieceFrom,Piece):-
    Piece is PieceFrom -1,
    Piece \= PieceFrom.

new_piece_white_tile(PieceFrom,Piece):-
    Aux is PieceFrom mod 10,
    Aux == 1,
    !,  
    Piece is PieceFrom,
    Piece == PieceFrom.
new_piece_white_tile(PieceFrom,Piece):-
    Piece is PieceFrom +1,
    Piece \= PieceFrom.


%CONVERT Y LETTER TO NUMERICAL COORD
letter_to_coord(a,1).
letter_to_coord(b,2).
letter_to_coord(c,3).
letter_to_coord(d,4).
letter_to_coord(e,5).

%MOVE 
move(Move,Board,NewBoard):-
    %DECOMPOSE MOVE 
    nth1(1,Move,LineFromLetter),
    nth1(2,Move,ColumnFrom),
    nth1(3,Move,LineToLetter),
    nth1(4,Move,ColumnTo),
    %CONVERT LETTERS
    letter_to_coord(LineFromLetter,LineFrom),
    letter_to_coord(LineToLetter,LineTo),

    %GET PIECE AND TILE COLOR
    get_piece(LineFrom,ColumnFrom,PieceFrom,Board),
    get_piece(LineTo,ColumnTo,PieceTo,Board),
    check_tile(PieceFrom,TileFrom),
    check_tile(PieceTo,TileTo), % get tile to color 

    new_piece(TileTo,PieceFrom,Piece),
    %ERASE OLD PLACE
    set_piece(LineFrom,ColumnFrom,TileFrom,BoardAux,NewBoard),
    %NEW PLACE
    set_piece(LineTo,ColumnTo,Piece,Board,BoardAux).
   

%TO BE USED IN GAME TO GET THE MOVES COORDS

read_move(ListBoard,Coords):-
    repeat,
    nl,
    write('Move([LineFrom,ColumnFrom,LineTo,ComlumnTo])'),
    catch(read(Read),_Error,move_invalid_input_error),
    check_if_valid_move_input(Read),
    coords_to_list(Read,Coords),
    member(Coords,ListBoard),
    !.

move_invalid_input_error:-
    write('Error passing move'),
    nl,
    fail.