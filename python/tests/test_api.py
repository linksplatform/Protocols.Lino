"""API tests for Lino parser - ported from JS/Rust implementations."""

from platform_lino import Parser, Link


parser = Parser()


def test_is_ref_equivalent():
    """Test simple link behavior (equivalent to Rust is_ref test)."""
    simple_link = Link('some_value')
    assert simple_link.id == 'some_value'
    assert simple_link.values == []


def test_is_link_equivalent():
    """Test link with values."""
    link = Link('id', [Link('child')])
    assert link.id == 'id'
    assert len(link.values) == 1
    assert link.values[0].id == 'child'


def test_empty_link():
    """Test empty link formatting."""
    link = Link(None, [])
    output = str(link)
    assert output == '()'


def test_simple_link():
    """Test simple link parsing and formatting."""
    input_text = '(1: 1 1)'
    parsed = parser.parse(input_text)

    # Validate regular formatting
    output = parsed[0].format()
    expected = '(1: 1 1)'
    assert output == expected


def test_link_with_source_target():
    """Test link with source and target."""
    input_text = '(index: source target)'
    parsed = parser.parse(input_text)

    # Validate regular formatting
    output = parsed[0].format()
    assert output == input_text


def test_link_with_source_type_target():
    """Test link with source, type, and target."""
    input_text = '(index: source type target)'
    parsed = parser.parse(input_text)

    # Validate regular formatting
    output = parsed[0].format()
    assert output == input_text


def test_single_line_format():
    """Test single-line format parsing."""
    input_text = 'id: value1 value2'
    parsed = parser.parse(input_text)

    # The parser should handle single-line format
    output = parsed[0].format(True)  # less_parentheses mode
    assert 'id' in output
    assert 'value1' in output
    assert 'value2' in output


def test_quoted_references():
    """Test parsing of quoted references."""
    input_text = '("quoted id": "value with spaces")'
    parsed = parser.parse(input_text)

    output = parsed[0].format()
    assert 'quoted id' in output
    assert 'value with spaces' in output
