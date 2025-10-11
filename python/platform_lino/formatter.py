"""
Formatter for Lino notation.

Provides utilities for formatting Link objects back into Lino notation strings.
"""

from typing import List
from .link import Link


def format_links(links: List[Link], less_parentheses: bool = False) -> str:
    """
    Format a list of links into Lino notation.

    Args:
        links: List of Link objects to format
        less_parentheses: If True, omit parentheses where safe

    Returns:
        Formatted string in Lino notation
    """
    if not links:
        return ''
    return '\n'.join(link.format(less_parentheses) for link in links)
