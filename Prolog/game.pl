%---------------INCLUDES---------------%
:-use_module(library(system)).
:-consult('display.pl').
:-consult('moves.pl').
:-consult('utils.pl').
:-consult('menu.pl').
:-consult('valid_moves.pl').
:-consult('game_over.pl').
:-consult('bot.pl').

%----------------------------------%

% STARTING BOARD 
board([ 
    [510,501,510,501,510],
    [1,0,1,0,1],        
    [0,1,0,1,0],
    [1,0,1,0,1],
    [910,901,910,901,910]
]).

%GAME TYPES
game_type(1,pvp).
game_type(2,pvc).
game_type(3,cvc).

%PLAYER NAMES
player(5,red).
player(9,blue).

%----------PLAYER VS PLAYER----------%

%base cases, game ends if a winner is returned on game over function
pvp(_,_,Winner):-
    Winner == 5,
    write_winning_player(Winner).

pvp(_,_,Winner):-
    Winner == 9,
    write_winning_player(Winner).

pvp(Board,PlayerPlaying,_):-
    valid_moves(Board,PlayerPlaying,ListMoves),
    read_move(ListMoves,Move), %read until the input is correct and move is valid
    clear_console,
    move(Move,Board,NewBoard), %move piece
    change_player_playing(PlayerPlaying,NewPlayerPlaying), %prepare next move
    player(NewPlayerPlaying,PlayerName),
    display_game(NewBoard,PlayerName), %display board state after the move
    game_over(NewBoard,PlayerPlaying,NewWinner), %check for a game over condition
    pvp(NewBoard,NewPlayerPlaying,NewWinner). %play again 

%setup pvp with the board and init game 
pvp(Board):-
    player(PlayerPlaying,red),
    display_game(Board,red),
    pvp(Board,PlayerPlaying,_).

%IMP- all game modes bellow use the same code organization and structure with some exceptions that are noted

%---------PLAYER VS COMPUTER-----------%

%base cases game ends when winenr is returned
pvc(_,_,_,_,Winner):-
    Winner == 5, 
    write_winning_player(Winner).

pvc(_,_,_,_,Winner):-
    Winner == 9, 
    write_winning_player(Winner).

%player moves 
pvc(Board, Level, PlayerPlaying,TurnNo,_):-
    PlayerPlaying == 9,
    !,
    valid_moves(Board,PlayerPlaying,ListMoves),
    read_move(ListMoves,Move), %read until the input is correct and move is valid
    clear_console,
    move(Move,Board,NewBoard), %move piece 
    change_player_playing(PlayerPlaying,NewPlayerPlaying),
    player(NewPlayerPlaying,PlayerName),
    display_game(NewBoard,PlayerName),
    game_over(NewBoard,PlayerPlaying,NewWinner),
    pvc(NewBoard, Level, NewPlayerPlaying,TurnNo,NewWinner).

%computer moves
pvc(Board, Level, PlayerPlaying,TurnNo,_):-
    TurnNo == 1, 
    !, 
    write('Computer is playing...'),
    choose_move(Board, 1, PlayerPlaying, Move), %use this predicate to choose the move, accessing the AI
    sleep(1),   %so that we can see the board
    clear_console,
    move(Move,Board,NewBoard), %move piece
    change_player_playing(PlayerPlaying,NewPlayerPlaying),
    player(NewPlayerPlaying,PlayerName),
    display_game(NewBoard,PlayerName),
    game_over(NewBoard,PlayerPlaying,NewWinner),
    NewTurnNo is TurnNo + 1, 
    pvc(NewBoard, Level, NewPlayerPlaying,NewTurnNo,NewWinner).

pvc(Board, Level, PlayerPlaying,TurnNo,_):-
    write('Computer is playing...'),
    choose_move(Board, Level, PlayerPlaying, Move),
    sleep(1),
    clear_console,
    move(Move,Board,NewBoard), %move piece
    change_player_playing(PlayerPlaying,NewPlayerPlaying),
    player(NewPlayerPlaying,PlayerName),
    display_game(NewBoard,PlayerName),
    game_over(NewBoard,PlayerPlaying,NewWinner),
    NewTurnNo is TurnNo + 1,
    pvc(NewBoard, Level, NewPlayerPlaying,NewTurnNo,NewWinner). 

%game init
pvc(Board, Level):-
    player(PlayerPlaying,red),
    display_game(Board, red),
    pvc(Board, Level, PlayerPlaying,1,_).

%turn numbers added so that the level 2 ai performs a random move at the first turn
%avoinding determinitic bots, and always the same game performing over and over with same calculations

%------------COMPUTER VS COMPUTER-----------% 
%same implementaion used before, but the move selection is always called
%useing choose_moove accessing the ai bot

%base case 
cvc(_,_,_,_,Winner):-
    Winner == 5, 
    write_winning_player(Winner).

cvc(_,_,_,_,Winner):-
    Winner == 9, 
    write_winning_player(Winner).

%keeps the turn counter so taht first move is not deterministic on a level 2 bot 
cvc(Board,Level,PlayerPlaying,TurnNo,_):-
    TurnNo < 3,
    !,
    choose_move(Board,1,PlayerPlaying,Move),
    sleep(1),
    clear_console,
    move(Move,Board,NewBoard),
    change_player_playing(PlayerPlaying,NewPlayerPlaying),
    player(NewPlayerPlaying,PlayerName),
    display_game(NewBoard,PlayerName),
    game_over(NewBoard,PlayerPlaying,NewWinner),
    NewTurnNo is TurnNo + 1,
    cvc(NewBoard,Level,NewPlayerPlaying,NewTurnNo,NewWinner).
cvc(Board,Level,PlayerPlaying,TurnNo,_):-
    choose_move(Board,Level,PlayerPlaying,Move),
    sleep(1),
    clear_console,
    move(Move,Board,NewBoard),
    change_player_playing(PlayerPlaying,NewPlayerPlaying),
    player(NewPlayerPlaying,PlayerName),
    display_game(NewBoard,PlayerName),
    game_over(NewBoard,PlayerPlaying,NewWinner),
    cvc(NewBoard,Level,NewPlayerPlaying,TurnNo,NewWinner).

%init game   
cvc(Board,Level):-
    player(PlayerPlaying,red),
    display_game(Board,red),
    cvc(Board,Level,PlayerPlaying,1,_).

%---------CALL GAME TYPE-------%
start_game(Type):-
    board(Board),
    Type == pvp,
    !,
    StartGame =..[Type,Board],
    StartGame.
start_game(Type):-
    Type == pvc,
    !,
    board(Board),
    get_ai_level(Level),
    StartGame =..[Type,Board,Level],
    StartGame.
start_game(Type):-
    Type == cvc,
    board(Board),
    get_ai_level(Level),
    StartGame =.. [Type,Board,Level],
    StartGame.

%--------MAIN PREDICATE TO START PROGRAM------%
play:-
    menu(Option),
    game_type(Option,Type),
    clear_console,
    start_game(Type).