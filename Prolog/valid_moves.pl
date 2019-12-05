%INCLUDES
:-use_module(library(lists)).

%-------------- VALID MOVES ---------------%
valid_moves(Board, Player, List_Moves):-
    Player == 5,
    !,  
    red_player_moves(Board, Board, 1, [], List_Moves).
valid_moves(Board, _, List_Moves):-
    blue_player_moves(Board, Board, 1, [], List_Moves).
%------------------------------------------%

% BLUE PLAYER MOVES %
blue_player_moves(_,_, 6, List_Moves, ReturnedMoves):- append(List_Moves,[],ReturnedMoves).
blue_player_moves([Line|Rest], Board, Board_Y, List_Moves, ReturnedMoves):-
    Board_X is 1,
    line_moves(9, Line, Board, Board_X, Board_Y, [], Line_Moves),
    append(List_Moves, Line_Moves, All_Moves),
    NextY is Board_Y + 1,
    blue_player_moves(Rest, Board, NextY, All_Moves, ReturnedMoves).

% RED PLAYER MOVES %
red_player_moves(_,_, 6, List_Moves, ReturnedMoves):- append(List_Moves,[],ReturnedMoves).
red_player_moves([Line|Rest], Board, Board_Y, List_Moves, ReturnedMoves):-
    Board_X is 1,
    line_moves(5, Line, [Line|Rest], Board_X, Board_Y, [], Line_Moves),
    append(List_Moves, Line_Moves, All_Moves),
    NextY is Board_Y + 1,
    red_player_moves(Rest, Board, NextY, All_Moves, ReturnedMoves).

%----------- EXTRACT MOVES IN LINE ------------%
line_moves(_, _, _, 6, _, List_Moves, ReturnedMoves):- append(List_Moves,[],ReturnedMoves).
line_moves(PlayerColor, [Elem|Rest], Board, Board_X, Board_Y, List_Moves, ReturnedMoves):-
    Piece_and_Cell_Nature is Elem mod 100,
    PieceColor is floor(Elem / 100),
    PlayerColor == PieceColor,
    !,
    common_moves(PlayerColor, Board, Board_X, Board_Y, Common_Moves),
    special_moves(Piece_and_Cell_Nature, PlayerColor, Board, Board_X, Board_Y, Special_Moves),
    append(Common_Moves, Special_Moves, Piece_Moves),
    append(List_Moves, Piece_Moves, All_Moves),
    NextX is Board_X + 1,
    line_moves(PlayerColor, Rest, Board, NextX, Board_Y, All_Moves, ReturnedMoves).
    
line_moves(PlayerColor, [_|Rest], Board, Board_X, Board_Y, List_Moves, ReturnedMoves):-
    NextX is Board_X + 1,
    line_moves(PlayerColor, Rest, Board, NextX, Board_Y, List_Moves, ReturnedMoves).
%----------------------------------------------%

%--------------- COMMON MOVES -----------------%
common_moves(PlayerColor, Board, Board_X, Board_Y, Common_Moves):-
    UpY is Board_Y - 1,
    DownY is Board_Y + 1,
    LeftX is Board_X - 1,
    RightX is Board_X + 1,
    append([], [  [Board_Y, Board_X, UpY, Board_X],
                [Board_Y, Board_X, UpY, LeftX], 
                [Board_Y, Board_X, UpY, RightX], 
                [Board_Y, Board_X, DownY, Board_X], 
                [Board_Y, Board_X, DownY, LeftX], 
                [Board_Y, Board_X, DownY, RightX], 
                [Board_Y, Board_X, Board_Y, LeftX], 
                [Board_Y, Board_X, Board_Y, RightX]
            ],
            Moves),
    validate_common_moves(PlayerColor, Board, Moves, Common_Moves).

validate_common_moves(PlayerColor, Board, Moves, Common_Moves):-
    validate_common_and_knight_moves(PlayerColor, Board, Moves, Common_Moves).
%----------------------------------------------%

%--------------- SPECIAL MOVES ----------------%
special_moves(Piece_Nature_Cell_Color, PlayerColor, Board, Board_X, Board_Y, Moves):-
    Piece_Nature is floor(Piece_Nature_Cell_Color / 10),
    Cell_Color is Piece_Nature_Cell_Color mod 10,
    Piece_Nature == Cell_Color,
    !,
    bishop_moves(PlayerColor, Board, Board_X, Board_Y, Moves).

special_moves(_, PlayerColor, Board, Board_X, Board_Y, Moves):-
    knight_moves(PlayerColor, Board, Board_X, Board_Y, Moves).


% BISHOP MOVES %
bishop_moves(PlayerColor, Board, MoveFromX, MoveFromY, Moves):-
    TopY is MoveFromY - 2,  BottomY is MoveFromY + 2, LeftX is MoveFromX - 2, RightX is MoveFromX + 2,
    bishop_valid_moves(top_right, PlayerColor, Board, MoveFromX, MoveFromY, RightX, TopY, Top_Right),
    bishop_valid_moves(top_left, PlayerColor, Board, MoveFromX, MoveFromY, LeftX, TopY, Top_Left),
    append(Top_Right, Top_Left, Top),
    bishop_valid_moves(bottom_right, PlayerColor, Board, MoveFromX, MoveFromY, RightX, BottomY, Bottom_Right),
    bishop_valid_moves(bottom_left, PlayerColor, Board, MoveFromX, MoveFromY, LeftX, BottomY, Bottom_Left),
    append(Bottom_Right, Bottom_Left, Bottom),
    append(Top, Bottom, All_Moves),
    append([], All_Moves, Moves).


operands(top_right, 1, -1).
operands(top_left, -1, -1).
operands(bottom_right, 1, 1).
operands(bottom_left, -1, 1).

bishop_valid_moves(Direction, PlayerColor, Board, MoveFromX, MoveFromY, MoveToX, MoveToY, [Head|Tail]):-
    letter_to_coord(MoveToYLetter, MoveToY),
    MoveToX > 0,
    MoveToX < 6,
    nth1(MoveToY, Board, Line),
    nth1(MoveToX, Line, Element),
    Empty is floor(Element / 100),
    Empty == 0,
    letter_to_coord(MoveFromYLetter, MoveFromY),
    append([], [MoveFromYLetter, MoveFromX, MoveToYLetter, MoveToX], Head),
    operands(Direction, OpX, OpY),
    NextX is MoveToX + OpX,
    NextY is MoveToY + OpY,
    bishop_valid_moves(Direction, PlayerColor, Board, MoveFromX, MoveFromY, NextX, NextY, Tail).

bishop_valid_moves(_, PlayerColor, Board, MoveFromX, MoveFromY, MoveToX, MoveToY, [Head|Tail]):-
    letter_to_coord(MoveToYLetter, MoveToY),
    MoveToX > 0,
    MoveToX < 6,
    nth1(MoveToY, Board, Line),
    nth1(MoveToX, Line, Element),
    PieceColor is floor(Element / 100), 
    PlayerColor \= PieceColor,
    letter_to_coord(MoveFromYLetter, MoveFromY),
    append([], [MoveFromYLetter, MoveFromX, MoveToYLetter, MoveToX], Head),
    bishop_valid_moves(0, 0, 0, 0, 0, 0, 0, Tail).

bishop_valid_moves(_, _, _, _, _, _, _, List):-append([],[],List).
%--------------%

% KNIGHT MOVES %
knight_moves(PlayerColor, Board, Board_X, Board_Y, Knight_Moves):-
    UpY is Board_Y - 2,
    DownY is Board_Y + 2,
    PosOffsetY is Board_Y + 1,
    NegOffsetY is Board_Y - 1,
    LeftX is Board_X - 2,
    RightX is Board_X + 2,
    PosOffsetX is Board_X + 1,
    NegOffsetX is Board_X - 1,
    append([], 
            [
                [Board_Y, Board_X, UpY, NegOffsetX], [Board_Y, Board_X, UpY, PosOffsetX], % UpMoves
                [Board_Y, Board_X, DownY, NegOffsetX], [Board_Y, Board_X, DownY, PosOffsetX], % DownMoves
                [Board_Y, Board_X, PosOffsetY, LeftX], [Board_Y, Board_X, NegOffsetY, LeftX], % LeftMoves
                [Board_Y, Board_X, PosOffsetY, RightX], [Board_Y, Board_X, NegOffsetY, RightX]  % RightMoves
            ],
            Moves),
    validate_knight_moves(PlayerColor, Board, Moves, Knight_Moves).

validate_knight_moves(PlayerColor, Board, Moves, Knight_Moves):-
    validate_common_and_knight_moves(PlayerColor, Board, Moves, Knight_Moves).
%--------------%
%----------------------------------------------%

%----- COMMON AND KNIGHT MOVES VALIDATION -----%
validate_common_and_knight_moves(_,_,[],List):- append([], [], List).
validate_common_and_knight_moves(PlayerColor, Board, [Move|Rest], [Common_Move|Rest_Common_Moves]):-
    nth1(1, Move, MoveFromY),
    nth1(2, Move, MoveFromX),
    nth1(3, Move, MoveToY),
    nth1(4, Move, MoveToX),
    letter_to_coord(MoveToYLetter, MoveToY),
    MoveToX > 0,
    MoveToX < 6,
    nth1(MoveToY, Board, Line),
    nth1(MoveToX, Line, Element),
    PieceColor is floor(Element / 100),
    PlayerColor \= PieceColor,
    letter_to_coord(MoveFromYLetter, MoveFromY),
    append([], [MoveFromYLetter, MoveFromX, MoveToYLetter, MoveToX], Common_Move),
    validate_common_and_knight_moves(PlayerColor, Board, Rest, Rest_Common_Moves).

validate_common_and_knight_moves(PlayerColor, Board, [_|Rest], Common_Moves):-
    validate_common_and_knight_moves(PlayerColor, Board, Rest, Common_Moves).
%----------------------------------------------%
    



