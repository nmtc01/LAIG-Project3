:-use_module(library(lists)).

valid_inputs_letter(a).
valid_inputs_letter(b).
valid_inputs_letter(c).
valid_inputs_letter(d).
valid_inputs_letter(e).
valid_inputs_number(1).
valid_inputs_number(2).
valid_inputs_number(3).
valid_inputs_number(4).
valid_inputs_number(5).

bot_level(1).
bot_level(2).


%CONVERT COORDS LIKE A,1,B,2 TO LIST [A,1,B,2]
coords_to_list((A,B,C,D),[A,B,C,D]).

check_if_valid_move_input((A,B,C,D)):-  
    atom(A),
    atom(C),
    valid_inputs_letter(A),
    valid_inputs_letter(C),
    valid_inputs_number(B),
    valid_inputs_number(D).

write_winning_player(Winner):-
    player(Winner,Name), 
    nl, 
    write('Player '),
    write(Name),
    write(' Win!').

change_player_playing(OldPlayerPlaying,NewPlayerPlaying):-
    OldPlayerPlaying == 5,
    !, 
    NewPlayerPlaying is 9.
change_player_playing(_,NewPlayerPlaying):-
    NewPlayerPlaying is 5. 

get_ai_level(Level):-
    repeat,
    nl,
    write('Bot level (1/2) ? '),
    catch(read(Level),_Error,ai_level_error),
    bot_level(Level),
    !.

ai_level_error:-
    write('Error reading ai level -  must be 1/2 followed by a dot (only lower case letters)'),
    nl,
    fail.

clear_console:- write('\e[H\e[2J').