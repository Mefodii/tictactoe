def write_lines_to_file(file_name, file_text):
    result_file = open(file_name, 'w')
    for result_line in file_text:
        result_file.write(str(result_line) + "\n")
    result_file.close()

def write_to_log(lines):
    write_lines_to_file("tictactoe_log.txt", lines)