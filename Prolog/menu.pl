%INCLUDES
:-use_module(library(lists)).

valid_game_mode(1).
valid_game_mode(2).
valid_game_mode(3).

menu(Option):-
    print_menu,
    get_option(Option).

get_option(Option):-
    repeat,
    write('-> Select game option '),
    catch(read(Option),_Error,menu_option_error),
    valid_game_mode(Option).
    
menu_option_error:-
    write('Menu option should be a 1/2/3/4/5 followed by a dot'),
    nl,
    fail.

return_menu_option_error:- 
    write('Type escape to return to the menu'),
    nl,
    fail.

print_menu:-
    write('+---------------------------------------------------------------------------------------------------------------------+'),nl,
    write('|                                                                                                                     |'),nl,
    write('|                  ######  ##     ##    ###    ##     ## ######## ##       ########  #######  ##    ##                |'),nl,
    write('|                 ##    ## ##     ##   ## ##   ###   ### ##       ##       ##       ##     ## ###   ##                |'),nl,
    write('|                 ##       ##     ##  ##   ##  #### #### ##       ##       ##       ##     ## ####  ##                |'),nl,
    write('|                 ##       ######### ##     ## ## ### ## ######   ##       ######   ##     ## ## ## ##                |'),nl,
    write('|                 ##    ## ##     ## ##     ## ##     ## ##       ##       ##       ##     ## ##   ###                |'),nl, 
    write('|                  ######  ##     ## ##     ## ##     ## ######## ######## ########  #######  ##    ##                |'),nl,
    write('|                                                                                                                     |'),nl,
    write('|---------------------------------------------------------------------------------------------------------------------|'),nl,
    write('|                                                                                                                     |'),nl,
    write('|                                              1 - Player vs Player                                                   |'),nl,
    write('|                                                                                                                     |'),nl,
    write('|                                              2 - Player vs Computer                                                 |'),nl,
    write('|                                                                                                                     |'),nl,
    write('|                                              3 - Computer vs Computer                                               |'),nl,
    write('|                                                                                                                     |'),nl,                                                                                                                   
    write('+---------------------------------------------------------------------------------------------------------------------+'),nl,nl.