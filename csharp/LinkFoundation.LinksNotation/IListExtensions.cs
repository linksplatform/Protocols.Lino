using Platform.Collections;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;

namespace Link.Foundation.Links.Notation
{
    /// <summary>
    /// Provides extension methods for formatting collections of <see cref="Link{TLinkAddress}"/> instances.
    /// </summary>
    public static class IListExtensions
    {
        /// <summary>
        /// Formats a collection of links as a multi-line string with each link on a separate line.
        /// </summary>
        /// <typeparam name="TLinkAddress">The type used for link addresses/identifiers.</typeparam>
        /// <param name="links">The collection of links to format.</param>
        /// <returns>A multi-line string representation of the links.</returns>
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static string Format<TLinkAddress>(this IList<Link<TLinkAddress>> links) => string.Join(Environment.NewLine, links.Select(l => l.ToString()));

        /// <summary>
        /// Formats a collection of links as a multi-line string with optional parentheses trimming for cleaner output.
        /// </summary>
        /// <typeparam name="TLinkAddress">The type used for link addresses/identifiers.</typeparam>
        /// <param name="links">The collection of links to format.</param>
        /// <param name="lessParentheses">True to remove outer parentheses from each link for cleaner formatting; false to use standard formatting.</param>
        /// <returns>A multi-line string representation of the links.</returns>
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static string Format<TLinkAddress>(this IList<Link<TLinkAddress>> links, bool lessParentheses)
        {
            if (lessParentheses == false)
            {
                return links.Format();
            }
            else
            {
                return string.Join(Environment.NewLine, links.Select(l => l.ToString().TrimSingle('(').TrimSingle(')')));
            }
        }
    }
}
