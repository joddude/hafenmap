rem Batch file for generate tileset from TP Map Tool
rem You must set center on your map as on public map

set SOURCE_FOLDER=d:\TP Map Tool\map
set DESTINATION_FOLDER=d:\hafenmap\tiles

xcopy "%SOURCE_FOLDER%\1" "%DESTINATION_FOLDER%\land\5\" /E /Y /Q /D
xcopy "%SOURCE_FOLDER%\2" "%DESTINATION_FOLDER%\land\6\" /E /Y /Q /D
xcopy "%SOURCE_FOLDER%\3" "%DESTINATION_FOLDER%\land\7\" /E /Y /Q /D
xcopy "%SOURCE_FOLDER%\4" "%DESTINATION_FOLDER%\land\8\" /E /Y /Q /D
xcopy "%SOURCE_FOLDER%\5" "%DESTINATION_FOLDER%\land\9\" /E /Y /Q /D

xcopy "%SOURCE_FOLDER%\Cave1\1" "%DESTINATION_FOLDER%\cave1\5\" /E /Y /Q /D
xcopy "%SOURCE_FOLDER%\Cave1\2" "%DESTINATION_FOLDER%\cave1\6\" /E /Y /Q /D
xcopy "%SOURCE_FOLDER%\Cave1\3" "%DESTINATION_FOLDER%\cave1\7\" /E /Y /Q /D
xcopy "%SOURCE_FOLDER%\Cave1\4" "%DESTINATION_FOLDER%\cave1\8\" /E /Y /Q /D
xcopy "%SOURCE_FOLDER%\Cave1\5" "%DESTINATION_FOLDER%\cave1\9\" /E /Y /Q /D

xcopy "%SOURCE_FOLDER%\Cave2\1" "%DESTINATION_FOLDER%\cave2\5\" /E /Y /Q /D
xcopy "%SOURCE_FOLDER%\Cave2\2" "%DESTINATION_FOLDER%\cave2\6\" /E /Y /Q /D
xcopy "%SOURCE_FOLDER%\Cave2\3" "%DESTINATION_FOLDER%\cave2\7\" /E /Y /Q /D
xcopy "%SOURCE_FOLDER%\Cave2\4" "%DESTINATION_FOLDER%\cave2\8\" /E /Y /Q /D
xcopy "%SOURCE_FOLDER%\Cave2\5" "%DESTINATION_FOLDER%\cave2\9\" /E /Y /Q /D

xcopy "%SOURCE_FOLDER%\Cave3\1" "%DESTINATION_FOLDER%\cave3\5\" /E /Y /Q /D
xcopy "%SOURCE_FOLDER%\Cave3\2" "%DESTINATION_FOLDER%\cave3\6\" /E /Y /Q /D
xcopy "%SOURCE_FOLDER%\Cave3\3" "%DESTINATION_FOLDER%\cave3\7\" /E /Y /Q /D
xcopy "%SOURCE_FOLDER%\Cave3\4" "%DESTINATION_FOLDER%\cave3\8\" /E /Y /Q /D
xcopy "%SOURCE_FOLDER%\Cave3\5" "%DESTINATION_FOLDER%\cave3\9\" /E /Y /Q /D

xcopy "%SOURCE_FOLDER%\Cave4\1" "%DESTINATION_FOLDER%\cave4\5\" /E /Y /Q /D
xcopy "%SOURCE_FOLDER%\Cave4\2" "%DESTINATION_FOLDER%\cave4\6\" /E /Y /Q /D
xcopy "%SOURCE_FOLDER%\Cave4\3" "%DESTINATION_FOLDER%\cave4\7\" /E /Y /Q /D
xcopy "%SOURCE_FOLDER%\Cave4\4" "%DESTINATION_FOLDER%\cave4\8\" /E /Y /Q /D
xcopy "%SOURCE_FOLDER%\Cave4\5" "%DESTINATION_FOLDER%\cave4\9\" /E /Y /Q /D

xcopy "%SOURCE_FOLDER%\Cave5\1" "%DESTINATION_FOLDER%\cave5\5\" /E /Y /Q /D
xcopy "%SOURCE_FOLDER%\Cave5\2" "%DESTINATION_FOLDER%\cave5\6\" /E /Y /Q /D
xcopy "%SOURCE_FOLDER%\Cave5\3" "%DESTINATION_FOLDER%\cave5\7\" /E /Y /Q /D
xcopy "%SOURCE_FOLDER%\Cave5\4" "%DESTINATION_FOLDER%\cave5\8\" /E /Y /Q /D
xcopy "%SOURCE_FOLDER%\Cave5\5" "%DESTINATION_FOLDER%\cave5\9\" /E /Y /Q /D

pause

