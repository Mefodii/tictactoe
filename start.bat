set venv_folder=dj-test
set project_folder=tictactoe
set redis_server=D:\Python\Redis\redis64-2.8.17\start-server-with-config.bat
start cmd.exe /k "call %redis_server% & ..\%venv_folder%\Scripts\activate.bat & python manage.py runserver"