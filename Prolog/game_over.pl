:-dynamic(number_of_pieces/2). %avoid using this 

%GET LIST OF THE VALID MOVES (return ListOfMoves)

game_over(Board,PlayerPlaying,Winner):-
    %check if someone forgot to eat the piece on their side  
    check_if_forget_to_eat(Board,PlayerPlaying,Winner),
    check_if_no_pieces(Board,0,0,CountedRedPieces,CountedBluePieces,Winner), %first winning condition check if no pieces
    check_if_end_reached_one_piece(Board,CountedRedPieces,CountedBluePieces,Winner), %2nd, check if player reached the end with one piece
    check_if_end_reached(Board,PlayerPlaying,Winner), % 3rd check if player reached the end and the oposing player can eat
    integer(Winner), %if winner is found stop and return winner playerr number
    !,
    true.
game_over(_,_,Winner):- %else return -1 meaning no winnner found 
    Winner is -1.

%CHECK THE FIRST WINNING CONDITION - LOSE ALL PIECES - AND GET NUMBER OF PIECES ON BOARD 

%base case if someone lose all pieces oponent wins 
check_if_no_pieces([],RedPieces,BluePieces,RedPieces,BluePieces,Winner):-
    RedPieces == 0,
    Winner is 9.

check_if_no_pieces([],RedPieces,BluePieces,RedPieces,BluePieces,Winner):-  
    BluePieces == 0, 
    Winner is 5. 

%iterate all board and count each piece by color 
check_if_no_pieces([],RedPieces,BluePieces,RedPieces,BluePieces,_). 
check_if_no_pieces([Line|More],RedPieces,BluePieces,CountedRedPieces,CountedBluePieces,Winner):-
    check_pieces_in_line(Line,RedPieces,BluePieces,NewRedPieces,NewBluePieces), %count line by line 
    check_if_no_pieces(More,NewRedPieces,NewBluePieces,CountedRedPieces,CountedBluePieces,Winner).

%CHECK IF LINE HAS PIECES 
check_pieces_in_line([],RedPieces,BluePieces,RedPieces,BluePieces). %Unify pieces
    
check_pieces_in_line([X|More],RedPieces,BluePieces,NewRedPieces,NewBluePieces):- %if is a tile 
    N is floor(X/100),
    N == 0,  
    !,
    check_pieces_in_line(More,RedPieces,BluePieces,NewRedPieces,NewBluePieces).
check_pieces_in_line([X|More],RedPieces,BluePieces,NewRedPieces,NewBluePieces):- %if not tile
    check_piece_color_in_line(X,RedPieces,BluePieces,NewRedPieces,NewBluePieces,More).

check_piece_color_in_line(X,RedPieces,BluePieces,NewRedPieces,NewBluePieces,More):- %count each piece in one line 
    N is floor(X/100),
    N == 5,  %if read piece 
    !,
    RedPiecesIncrement is RedPieces + 1,
    check_pieces_in_line(More,RedPiecesIncrement,BluePieces,NewRedPieces,NewBluePieces).
check_piece_color_in_line(X,RedPieces,BluePieces,NewRedPieces,NewBluePieces,More):- %else blue piece
    N is floor(X/100),
    N == 9,  
    BluePiecesIncrement is BluePieces + 1,
    check_pieces_in_line(More,RedPieces,BluePiecesIncrement,NewRedPieces,NewBluePieces).

%2ND WINNING CONDITION - REACH THE BOTTOM OF THE BOARD - IF ONLY ONE PIECE LEFT

%case blue can win
check_if_end_reached_one_piece(Board,_, CountedBluePieces,Winner):-
    CountedBluePieces == 1, %if has one piece
    nth1(1,Board,First), %get opsing line 
    line_has_piece_with_color(First,9), %check if there is a piece in that line
    Winner is 9.

%case red can win
check_if_end_reached_one_piece(Board,CountedRedPieces,_,Winner):-
    CountedRedPieces == 1, %if has one piece
    nth1(5,Board,Last), % get oposing line
    line_has_piece_with_color(Last,5), %check if there is a piece in that line
    Winner is 5.

check_if_end_reached_one_piece(_,_,_,_). %do nothing if there are more than 1 piece

%3RD ITERATION

%same procedure as the sencond iteration, but doest care about the piece number
%but it will check if there are any valid moves that can eat the piece moved

%if red can win 
check_if_end_reached(Board,PlayerPlaying,_):-
    PlayerPlaying = 5,
    nth1(5,Board,Last),
    line_has_piece_with_color(Last,5),
    valid_moves(Board,9,ValidMoves),
    get_piece_tile(Last,5,e,1,PiecePlace),
    check_if_piece_can_be_eaten(ValidMoves,PiecePlace),
    !,
    true. 
check_if_end_reached(Board,PlayerPlaying,Winner):-
    PlayerPlaying = 5,
    nth1(5,Board,Last),
    line_has_piece_with_color(Last,5),
    Winner is 5.

%if blue can win 
check_if_end_reached(Board,PlayerPlaying,_):-
    PlayerPlaying = 9,
    nth1(1,Board,First),
    line_has_piece_with_color(First,9),
    valid_moves(Board,5,ValidMoves),
    get_piece_tile(First,9,a,1,PiecePlace),
    check_if_piece_can_be_eaten(ValidMoves,PiecePlace),
    !,
    true. 
check_if_end_reached(Board,PlayerPlaying,Winner):-
    PlayerPlaying = 9,
    nth1(1,Board,First),
    line_has_piece_with_color(First,9),
    Winner is 9.

check_if_end_reached(_,_,_).

%CHECK IF PLAYER FORGOT TO EAT THE PIECE

%check if the player has an oposing piece in his back line, 
%if it does means that he didnt eat the piece during his move
check_if_forget_to_eat(Board,PlayerPlaying,Winner):-
    PlayerPlaying = 9, 
    nth1(5,Board,Last),
    line_has_piece_with_color(Last,5),
    Winner is 5.

check_if_forget_to_eat(Board,PlayerPlaying,Winner):-
    PlayerPlaying = 5,
    nth1(1,Board,Last),
    line_has_piece_with_color(Last,9),
    Winner is 9.

check_if_forget_to_eat(_,_,_).


%-------------UTILS----------------%

%IMP on 3rd iteration,
check_if_piece_can_be_eaten([],_):-
    false.
check_if_piece_can_be_eaten([Move|_],PiecePlace):-
    %compare last 2 members
    nth1(3,Move,MoveLine),
    nth1(4,Move,MoveColum),
    create_2_elem_list(MoveLine,MoveColum,MoveTo),
    MoveTo == PiecePlace,
    !,
    true. %idk what to go here tbh 
check_if_piece_can_be_eaten([_|Rest],PiecePlace):-   
    check_if_piece_can_be_eaten(Rest,PiecePlace).
    
create_2_elem_list(A,B,[A,B]).

get_piece_tile([X|_],Color,LineName,Aux,[LineName,C]):-
    N is floor(X/100),
    N = Color, 
    !,
    C is Aux.
get_piece_tile([_|Rest],Color,LineName,Aux,[LineName,C]):-
    NewAux is Aux +1, 
    get_piece_tile(Rest,Color,LineName,NewAux,[LineName,C]).

last_elem([],X,X).
last_elem([X|Rest],_,Last):-
    last_elem(Rest,X,Last).

first_elem([X|_],X).

%in this case will only have a piece always 
line_has_piece_with_color([],_):-
    fail.
line_has_piece_with_color([X|Rest],Color):-
    N is floor(X/100),
    N \= Color,
    !,
    line_has_piece_with_color(Rest,Color).
line_has_piece_with_color([_|_],_):-
   true.
