%INCLUDES
:-use_module(library(lists)).

%GRID
coord_x(['1','2','3','4','5']).
coord_y(['A ','B ','C ','D ','E ']).

%COLOR SYNESTHESIA: |0 - Black | 1 - White | 5 - Red | 9 - Blue 
board_elem(1,white_empty).
board_elem(0,black_empty). 
board_elem(2,dot).

%PIECES CODED AS: COLOR - NATURE - CELL

% BLUE PIECES
board_elem(910,black_w/blue_white).
board_elem(900,black_w/blue_black).
board_elem(911,white_w/blue_white).
board_elem(901,white_w/blue_black).

% RED PIECES
board_elem(510,black_w/red_white). 
board_elem(500,black_w/red_black).
board_elem(511,white_w/red_white).
board_elem(501,white_w/red_black).

%LAYOUT DRAW
draw_delim('#########').

draw_elem_up_down(black_empty,'#:::::::#' ).
draw_elem_up_down(white_empty,'#       #' ).
draw_elem_up_down(dot,'#       #' ).
draw_elem_up_down(black_w/blue_white,'#:::::::#' ).
draw_elem_up_down(black_w/blue_black ,'#:::::::#' ).
draw_elem_up_down(black_w/red_white,'#:::::::#' ).
draw_elem_up_down(black_w/red_black,'#:::::::#' ).
draw_elem_up_down(white_w/blue_white,'#       #' ).
draw_elem_up_down(white_w/blue_black,'#       #' ).
draw_elem_up_down(white_w/red_white,'#       #' ).
draw_elem_up_down(white_w/red_black,'#       #' ).

draw_elem_mid(black_empty,'#::   ::#').
draw_elem_mid(dot,'#   o   #' ).
draw_elem_mid(white_empty,'#       #' ).
draw_elem_mid(black_w/blue_white,'#:: W ::#' ).
draw_elem_mid(black_w/blue_black ,'#:: B ::#' ).
draw_elem_mid(black_w/red_white,'#:: w ::#' ).
draw_elem_mid(black_w/red_black,'#:: b ::#' ).
draw_elem_mid(white_w/blue_white,'#   W   #' ).
draw_elem_mid(white_w/blue_black,'#   B   #' ).
draw_elem_mid(white_w/red_white,'#   w   #' ).
draw_elem_mid(white_w/red_black,'#   b   #' ).

%PRINT X GRID
print_x_coord([]):-
    write('\n').
print_x_coord([X|L]):-
    write(X),
    write('        '),
    print_x_coord(L).

%PRINT DELIM
printDelim([]):-
    write('\n').
printDelim([_|L]):-
    draw_delim(Draw),
    write(Draw),
    printDelim(L).

%PRINT TOP AND BOTTOM OF THE CELL
printUpDownCell([]):-
    write('\n').
printUpDownCell([X|L]):-
    board_elem(X,Type),
    draw_elem_up_down(Type,Draw),
    write(Draw),
    printUpDownCell(L).

%PRINT MID OF TEH CELL
printMid([]):-
    write('\n').
printMid([X|L]):-
    board_elem(X,Type),
    draw_elem_mid(Type,Draw),
    write(Draw),
    printMid(L).

%PRINT LINE GRID
printList([]).
printList(L,Y):-
    write('  '),
    printDelim(L),
    write('  '),
    printUpDownCell(L),
    write(Y),
    printMid(L),
    write('  '),
    printUpDownCell(L).

%PRINT BOARD
printBoard([],[]).
printBoard([X|L],[CY|CYL]):-
    printList(X,CY),
    printBoard(L,CYL).

%DISPLAY GAME
display_game(Board,Player):- 
    write(Player), 
    write(' is playing...'),
    nl,
    coord_x(CX), 
    coord_y(CY),
    write('      '),
    print_x_coord(CX),
    printBoard(Board, CY),
    write('  #############################################'),
    nl.