# map_tiles_downloader
# Script for downloading tiles from online maps
# Python v.3 required for using. https://www.python.org/downloads/
# Author: joddude <joddude@gmail.com>

# Disclaimer:
# This script is free and provided "as is" without any warranty.
# You can use it at your own risk.
# The author assumes no responsibility for any moral or material damage caused
# by the use of this software, any loss of profit as a result of or during use.


baseurl = 'http://www.odditown.com:8080/haven/tiles/live/'
filename_mask = '{z}/{x}_{y}.png'
x_start = -256
x_end = 256
y_start = -256
y_end = 256
z_start = 4
z_end = 9
download_dir = 'tiles/'
download_portion = 250
download_threads = 25
pause_on_error = 5


import os, sys
import time, datetime
import urllib.request
import math
import threading
from queue import Queue


files_queue = Queue()


def main():
    files_list = form_files_list()
    counter_saved = laststate_load()
    print('  baseurl: {0}  filename_mask: {1}'.format(baseurl, filename_mask))
    print('  x_start: {0}  x_end: {1}  y_start: {2}  y_end: {3}  z_start: {4}  z_end: {5}'.format(x_start, x_end, y_start, y_end, z_start, z_end))
    print('  files: {0}  done: {1}% ({2})'.format(len(files_list), round(counter_saved/len(files_list)*100, 1), counter_saved))
    print('  download_dir: {0}  download_portion: {1}  download_threads: {2}'.format(download_dir, download_portion, download_threads))
    print('Downloading.')
    for i in range(download_threads):
        t = threading.Thread(target=download_thread)
        t.daemon = True
        t.start()
    for counter in range(counter_saved, len(files_list), download_portion):
        if 'portion_start_time' in locals():
            speed = download_portion/(time.perf_counter() - portion_start_time)
            time_left = (len(files_list) - counter)/speed/60
        else:
            speed = 0
            time_left = 0
        status = '({0})  {1} files/sec  left: {2} min.'.format(str(counter), str(round(speed)), str(round(time_left)))
        update_progress((counter)/(len(files_list)), status)
        laststate_save(counter)
        portion_start_time = time.perf_counter()
        files_portion = files_list[counter:counter+download_portion]
        for filename in files_portion:
            files_queue.put(filename)
        files_queue.join()
    update_progress(1)
    laststate_save(len(files_list))


def form_files_list():
    files_list = []
    for z in range(z_start, z_end+1):
        if not os.path.exists(download_dir + str(z) + '/'):
            os.makedirs(download_dir + str(z) + '/')
        for x in range(math.floor(x_start/(2**(z_end-z))), math.ceil(x_end/(2**(z_end-z)))+1):
            for y in range(math.floor(y_start/(2**(z_end-z))), math.ceil(y_end/(2**(z_end-z)))+1):
                files_list.append(filename_mask.format(x=str(x), y=str(y), z=str(z)))
    return files_list


def download_thread():
    while True:
        filename = files_queue.get()
        if not download_file(filename):
            print('Restart downloading for file {0} after {1} seconds'.format(filename, pause_on_error))
            time.sleep(pause_on_error)
            files_queue.put(filename)
        files_queue.task_done()


def download_file(filename):
    target_filename = download_dir + filename
    try:
        response = urllib.request.urlopen(baseurl + filename)
    except:
        print('\r\nError downloading file {0} {1}'.format(filename, sys.exc_info()[0]))
        return False
    if response.getcode() == 200:
        with open(target_filename, 'wb') as f:
            f.write(response.read())
    return True


def laststate_load():
    if os.path.isfile('laststate.txt'):
        print('Load laststate.')
        with open('laststate.txt', 'r') as f:
            state = int(f.read())
    else:
        state = 0
    return state


def laststate_save(state):
    with open('laststate.txt', 'w') as f:
        f.write(str(state))


def update_progress(progress, status = ''):
    barLength = 50
    if isinstance(progress, int):
        progress = float(progress)
    if not isinstance(progress, float):
        progress = 0
        status = "error: progress var must be float\r\n"
    if progress < 0:
        progress = 0
        status = "Halt"+" "*21+"\r\n"
    if progress >= 1:
        progress = 1
        status = "Done"+" "*21+"\r\n"
    block = int(round(barLength*progress))
    text = '\rProgress: [{0}] {1}% {2}      '.format( '#'*block + '-'*(barLength-block), round(progress*100, 1), status)
    sys.stdout.write(text)
    sys.stdout.flush()


if __name__ == '__main__':
    try:
        print('Started. Press Ctrl+C to stop.')
        main()
    except KeyboardInterrupt:
        print()
        print('You pressed Ctrl+C. Stop')
        sys.exit()
    except:
        import sys
        print(sys.exc_info()[0])
        import traceback
        print(traceback.format_exc())
    finally:
        print()
        print('Finished. Press Enter to exit ...')
        input()

