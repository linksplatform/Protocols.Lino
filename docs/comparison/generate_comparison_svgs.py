#!/usr/bin/env python3
import re

CHAR_WIDTH = 8.4

def get_theme_colors(theme):
    if theme == 'light':
        return {
            'bg_color': '#ffffff',
            'line_num_color': '#888888',
            'text_color': '#000000',
            'keyword_color': '#0000ff',
            'string_color': '#008000',
            'number_color': '#ff0000',
            'tag_color': '#800080',
            'punctuation_color': '#000000',
            'border_color': '#cccccc',
            'title_color': '#000000'
        }
    elif theme == 'dark':
        return {
            'bg_color': '#1e1e1e',
            'line_num_color': '#858585',
            'text_color': '#d4d4d4',
            'keyword_color': '#569cd6',
            'string_color': '#ce9178',
            'number_color': '#b5cea8',
            'tag_color': '#4ec9b0',
            'punctuation_color': '#d4d4d4',
            'border_color': '#3e3e3e',
            'title_color': '#cccccc'
        }
    else:
        return {
            'bg_color': 'transparent',
            'line_num_color': '#888888',
            'text_color': '#333333',
            'keyword_color': '#0066cc',
            'string_color': '#007700',
            'number_color': '#cc0000',
            'tag_color': '#660099',
            'punctuation_color': '#333333',
            'border_color': '#999999',
            'title_color': '#666666'
        }

def highlight_lino(line, colors):
    result = []
    indent = len(line) - len(line.lstrip(' '))
    result.append((' ' * indent, colors['text_color']))

    content = line.lstrip(' ')

    if content in ('(', ')'):
        result.append((content, colors['punctuation_color']))
    elif content.endswith(':'):
        result.append((content[:-1], colors['keyword_color']))
        result.append((':', colors['punctuation_color']))
    else:
        paren_match = re.match(r'^([^(]+)(\(.+\))$', content)
        if paren_match:
            key = paren_match.group(1).rstrip()
            value = paren_match.group(2)
            result.append((key, colors['keyword_color']))
            result.append((' ', colors['text_color']))
            result.append(('(', colors['punctuation_color']))
            result.append((value[1:-1], colors['string_color']))
            result.append((')', colors['punctuation_color']))
        elif content and content[0].isdigit() and content.split()[0].isdigit():
            parts = content.split(None, 1)
            result.append((parts[0], colors['number_color']))
            if len(parts) > 1:
                result.append((' ' + parts[1], colors['text_color']))
        elif ' ' in content:
            parts = content.split(None, 1)
            if parts[1].isdigit():
                result.append((parts[0], colors['keyword_color']))
                result.append((' ', colors['text_color']))
                result.append((parts[1], colors['number_color']))
            else:
                result.append((content, colors['keyword_color']))
        else:
            result.append((content, colors['keyword_color']))

    return result

def highlight_yaml(line, colors):
    result = []
    indent = len(line) - len(line.lstrip(' '))
    result.append((' ' * indent, colors['text_color']))

    content = line.lstrip(' ')

    if content.startswith('- '):
        result.append(('- ', colors['punctuation_color']))
        content = content[2:]

    if ':' in content:
        key, value = content.split(':', 1)
        result.append((key, colors['keyword_color']))
        result.append((':', colors['punctuation_color']))
        if value.strip():
            value_stripped = value.lstrip()
            spaces = value[:len(value) - len(value_stripped)]
            result.append((spaces, colors['text_color']))
            if value_stripped.isdigit():
                result.append((value_stripped, colors['number_color']))
            else:
                result.append((value_stripped, colors['string_color']))
    else:
        result.append((content, colors['text_color']))

    return result

def highlight_json(line, colors):
    result = []
    indent = len(line) - len(line.lstrip(' '))
    result.append((' ' * indent, colors['text_color']))

    content = line.lstrip(' ')

    i = 0
    while i < len(content):
        if content[i] in '{}[]':
            result.append((content[i], colors['punctuation_color']))
            i += 1
        elif content[i] == '"':
            end = content.find('"', i + 1)
            if end != -1:
                string_val = content[i:end+1]
                if i > 0 and content[i-1] == ' ' or i == 0:
                    result.append((string_val, colors['keyword_color']))
                else:
                    result.append((string_val, colors['string_color']))
                i = end + 1
            else:
                result.append((content[i], colors['text_color']))
                i += 1
        elif content[i] == ':':
            result.append((':', colors['punctuation_color']))
            i += 1
        elif content[i] == ',':
            result.append((',', colors['punctuation_color']))
            i += 1
        elif content[i].isdigit():
            j = i
            while j < len(content) and content[j].isdigit():
                j += 1
            result.append((content[i:j], colors['number_color']))
            i = j
        elif content[i] == ' ':
            result.append((' ', colors['text_color']))
            i += 1
        else:
            result.append((content[i], colors['text_color']))
            i += 1

    return result

def highlight_xml(line, colors):
    result = []
    indent = len(line) - len(line.lstrip(' '))
    result.append((' ' * indent, colors['text_color']))

    content = line.lstrip(' ')

    i = 0
    while i < len(content):
        if content[i] == '<':
            end = content.find('>', i)
            if end != -1:
                tag = content[i:end+1]
                result.append(('<', colors['tag_color']))
                if tag[1] == '/':
                    result.append(('/', colors['tag_color']))
                    result.append((tag[2:-1], colors['tag_color']))
                else:
                    result.append((tag[1:-1], colors['tag_color']))
                result.append(('>', colors['tag_color']))
                i = end + 1
            else:
                result.append((content[i], colors['text_color']))
                i += 1
        else:
            j = i
            while j < len(content) and content[j] != '<':
                j += 1
            text_content = content[i:j]
            if text_content.isdigit():
                result.append((text_content, colors['number_color']))
            else:
                result.append((text_content, colors['string_color']))
            i = j

    return result

def render_line(tokens, x_start, y):
    svg_parts = []
    x = x_start
    for text, color in tokens:
        if text:
            escaped = text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')
            svg_parts.append(f'<tspan x="{x}" y="{y}" fill="{color}">{escaped}</tspan>')
            x += len(text) * CHAR_WIDTH
    return ''.join(svg_parts)

def render_format_box(format_name, box_x, box_y, lines, highlighter, colors, box_width, box_height, line_height, start_y, is_shared_border=False):
    # Only render border if not shared, or render partial border for shared borders
    if is_shared_border:
        # For shared borders, only draw left and top borders
        svg = f'  <line x1="{box_x}" y1="{box_y}" x2="{box_x + box_width}" y2="{box_y}" class="border-line"/>\n'
        svg += f'  <line x1="{box_x}" y1="{box_y}" x2="{box_x}" y2="{box_y + box_height}" class="border-line"/>\n'
    else:
        svg = f'  <rect x="{box_x}" y="{box_y}" width="{box_width}" height="{box_height}" class="border"/>\n'

    svg += f'  <text x="{box_x + box_width//2}" y="{box_y + 25}" text-anchor="middle" class="format-title">{format_name}</text>\n\n'

    for i, line in enumerate(lines):
        y = box_y + start_y - 50 + (i * line_height)
        line_num = i + 1

        svg += '  <text class="line-number">\n'
        svg += f'    <tspan x="{box_x + 20}" y="{y}">{line_num}</tspan>\n'
        svg += '  </text>\n'

        tokens = highlighter(line, colors)
        svg += '  <text xml:space="preserve">\n'
        svg += f'    {render_line(tokens, box_x + 50, y)}\n'
        svg += '  </text>\n\n'

    return svg

def get_format_data():
    lino_lines = [
        "empInfo",
        "  employees:",
        "    (",
        "      name (James Kirk)",
        "      age 40",
        "    )",
        "    (",
        "      name (Jean-Luc Picard)",
        "      age 45",
        "    )",
        "    (",
        "      name (Wesley Crusher)",
        "      age 27",
        "    )"
    ]

    yaml_lines = [
        "empInfo:",
        "  employees:",
        "    - name: James Kirk",
        "      age: 40",
        "    - name: Jean-Luc Picard",
        "      age: 45",
        "    - name: Wesley Crusher",
        "      age: 27"
    ]

    json_lines = [
        "{",
        '  "empInfo": {',
        '    "employees": [',
        "      {",
        '        "name": "James Kirk",',
        '        "age": 40',
        "      },",
        "      {",
        '        "name": "Jean-Luc Picard",',
        '        "age": 45',
        "      },",
        "      {",
        '        "name": "Wesley Crusher",',
        '        "age": 27',
        "      }",
        "    ]",
        "  }",
        "}"
    ]

    xml_lines = [
        "<empInfo>",
        "  <employees>",
        "    <employee>",
        "      <name>James Kirk</name>",
        "      <age>40</age>",
        "    </employee>",
        "    <employee>",
        "      <name>Jean-Luc Picard</name>",
        "      <age>45</age>",
        "    </employee>",
        "    <employee>",
        "      <name>Wesley Crusher</name>",
        "      <age>27</age>",
        "    </employee>",
        "  </employees>",
        "</empInfo>"
    ]

    return lino_lines, yaml_lines, json_lines, xml_lines

def create_svg_comparison(theme='light'):
    colors = get_theme_colors(theme)
    lino_lines, yaml_lines, json_lines, xml_lines = get_format_data()

    # Calculate box dimensions based on content
    box_width = 580
    box_height = 420
    line_height = 20
    start_y = 95

    # Total dimensions with shared borders
    margin = 20
    total_width = margin + (box_width * 2) + margin
    total_height = margin + 20 + (box_height * 2) + margin  # +20 for title

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {total_width} {total_height}" style="font-family: 'Courier New', monospace; font-size: 14px;">
  <defs>
    <style>
      .title {{ font-size: 18px; font-weight: bold; fill: {colors['title_color']}; }}
      .format-title {{ font-size: 16px; font-weight: bold; fill: {colors['title_color']}; }}
      .line-number {{ fill: {colors['line_num_color']}; }}
      .border {{ fill: none; stroke: {colors['border_color']}; stroke-width: 2; }}
      .border-line {{ stroke: {colors['border_color']}; stroke-width: 2; }}
      .bg {{ fill: {colors['bg_color']}; }}
    </style>
  </defs>

  <rect x="0" y="0" width="{total_width}" height="{total_height}" class="bg"/>

  <text x="{total_width//2}" y="30" text-anchor="middle" class="title">Format Comparison: LiNo, YAML, JSON, XML</text>

'''

    # Draw outer border for the entire 2x2 grid
    grid_x = margin
    grid_y = 50
    grid_width = box_width * 2
    grid_height = box_height * 2

    svg += f'  <rect x="{grid_x}" y="{grid_y}" width="{grid_width}" height="{grid_height}" class="border"/>\n'

    # Draw center vertical line
    svg += f'  <line x1="{grid_x + box_width}" y1="{grid_y}" x2="{grid_x + box_width}" y2="{grid_y + grid_height}" class="border-line"/>\n'

    # Draw center horizontal line
    svg += f'  <line x1="{grid_x}" y1="{grid_y + box_height}" x2="{grid_x + grid_width}" y2="{grid_y + box_height}" class="border-line"/>\n'

    svg += '\n'

    # Render boxes without their own borders (using the shared grid)
    boxes = [
        ("LiNo", grid_x, grid_y, lino_lines, highlight_lino),
        ("YAML", grid_x + box_width, grid_y, yaml_lines, highlight_yaml),
        ("JSON", grid_x, grid_y + box_height, json_lines, highlight_json),
        ("XML", grid_x + box_width, grid_y + box_height, xml_lines, highlight_xml)
    ]

    for format_name, box_x, box_y, lines, highlighter in boxes:
        # Add title
        svg += f'  <text x="{box_x + box_width//2}" y="{box_y + 25}" text-anchor="middle" class="format-title">{format_name}</text>\n\n'

        # Add content
        for i, line in enumerate(lines):
            y = box_y + start_y - 50 + (i * line_height)
            line_num = i + 1

            svg += '  <text class="line-number">\n'
            svg += f'    <tspan x="{box_x + 20}" y="{y}">{line_num}</tspan>\n'
            svg += '  </text>\n'

            tokens = highlighter(line, colors)
            svg += '  <text xml:space="preserve">\n'
            svg += f'    {render_line(tokens, box_x + 50, y)}\n'
            svg += '  </text>\n\n'

    svg += '</svg>\n'

    return svg

if __name__ == '__main__':
    themes = ['light', 'dark', 'universal']

    for theme in themes:
        svg_content = create_svg_comparison(theme)
        if theme == 'universal':
            filename = 'comparison.svg'
        else:
            filename = f'comparison-{theme}.svg'

        with open(filename, 'w') as f:
            f.write(svg_content)
        print(f'Created {filename}')
