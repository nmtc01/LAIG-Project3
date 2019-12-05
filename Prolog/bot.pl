%INCLUDES
:-use_module(library(random)).

%EVALUATE
value(Board, Player, Value):- %blue playe
    Player = 9,
    !, 
    calculate_value_blue(Board,Player,5,1,0,Value).
value(Board,Player,Value):- %red player 
    calculate_value_red(Board,Player,1,1,0,Value).

%calculate scores based on player colour, iterating every elem on the board list
calculate_value_blue(Board,_,0,_,CarryValue,Value):-
    count_pieces(Board,0,0,RedPieces,BluePieces),
    get_piece_ratio(BluePieces,RedPieces,Ratio),
    PieceScore is Ratio * 80,
    Value is CarryValue + PieceScore.
calculate_value_blue(Board,Player,Aux,LineScore,CarryValue,Value):-
    nth1(Aux,Board,Line),
    count_pieces_in_line(Line,9,0,Num),
    NewCarryValue is CarryValue + Num * LineScore,
    NewAux is Aux -1,
    NewLineScore is LineScore * 3,
    calculate_value_blue(Board,Player,NewAux,NewLineScore,NewCarryValue,Value).

calculate_value_red(Board,_,6,_,CarryValue,Value):-
    count_pieces(Board,0,0,RedPieces,BluePieces),
    get_piece_ratio(RedPieces,BluePieces,Ratio),
    PieceScore is Ratio * 40,
    Value is CarryValue + PieceScore.
calculate_value_red(Board,Player,Aux,LineScore,CarryValue,Value):-
    nth1(Aux,Board,Line),
    count_pieces_in_line(Line,5,0,Num),
    NewCarryValue is CarryValue + Num * LineScore,
    NewAux is Aux + 1,
    NewLineScore is LineScore * 3,
    calculate_value_red(Board,Player,NewAux,NewLineScore,NewCarryValue,Value).

%iterate through all valid moves and return the one with the highest value
get_best_move(_,_,[],_,BestMove,BestMove).
get_best_move(Board,Player,[NewMove|Rest],OldValue,_,BestMove):-
    move(NewMove,Board,NewBoard), %perform the move 
    value(NewBoard,Player,Value), %evaluate the move 
    Value > OldValue,
    !,
    get_best_move(Board,Player,Rest,Value,NewMove,BestMove).
get_best_move(Board,Player,[_|Rest],OldValue,TmpMove,BestMove):-
    get_best_move(Board,Player,Rest,OldValue,TmpMove,BestMove).

%choose the move to perform based on the highest value 
choose_value_move(Board, PlayerPlaying, Move):-
    valid_moves(Board,PlayerPlaying,ValidMoves), %get all possible moves on that moment
    get_best_move(Board,PlayerPlaying,ValidMoves,-1,_,Move). 

%BOT MOVE 
choose_move(Board,Level,PlayerPlaying,Move):-
    Level == 1,
    !,
    choose_random_move(Board, PlayerPlaying, Move).
choose_move(Board, _, PlayerPlaying, Move):-
    choose_value_move(Board, PlayerPlaying, Move).

choose_random_move(Board, PlayerPlaying, Move):-
    valid_moves(Board, PlayerPlaying, List_Moves),
    length(List_Moves, NumberOfMoves),
    random(0, NumberOfMoves, MoveIndex),
    nth0(MoveIndex, List_Moves, Move).


%--------UTILS--------%
count_pieces_in_line([],_,PieceNumber,PieceNumber).
count_pieces_in_line([X|Rest],Piece,Aux,PieceNumber):- 
    N is floor(X/100),
    N = Piece,
    !,
    NewAux is Aux + 1,
    count_pieces_in_line(Rest,Piece,NewAux,PieceNumber).
count_pieces_in_line([_|Rest],Piece,Aux,PieceNumber):- 
    count_pieces_in_line(Rest,Piece,Aux,PieceNumber).

%count all pieces on that board
count_pieces([],RedPieces,BluePieces,RedPieces,BluePieces). 
count_pieces([Line|Rest],RedPieces,BluePieces,CountedRedPieces,CountedBluePieces):-
    check_pieces_in_line(Line,RedPieces,BluePieces,NewRedPieces,NewBluePieces),
    count_pieces(Rest,NewRedPieces,NewBluePieces,CountedRedPieces,CountedBluePieces).

%diffrence between pices cant be lower than 0
get_piece_ratio(Player1,Player2,Ratio):-
   N is Player1 - Player2,
   N > 0,
   !,
   Ratio is Player1 -Player2.
get_piece_ratio(_,_,Ratio):-
    Ratio is 0. 
    
   
