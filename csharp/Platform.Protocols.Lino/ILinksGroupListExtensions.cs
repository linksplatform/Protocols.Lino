using System.Collections.Generic;
using System.Runtime.CompilerServices;

namespace Platform.Protocols.Lino
{
    /// <summary>
    /// Provides extension methods for collections of <see cref="LinksGroup{TLinkAddress}"/> instances.
    /// </summary>
    public static class ILinksGroupListExtensions
    {
        /// <summary>
        /// Converts a collection of links groups to a flat list of links by processing each group hierarchically.
        /// </summary>
        /// <typeparam name="TLinkAddress">The type used for link addresses/identifiers. This can be any type that uniquely identifies a link, such as string, int, or Guid.</typeparam>
        /// <param name="groups">The collection of links groups to convert.</param>
        /// <returns>A flat list of links representing all the links from the input groups.</returns>
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static List<Link<TLinkAddress>> ToLinksList<TLinkAddress>(this IList<LinksGroup<TLinkAddress>> groups)
        {
            var list = new List<Link<TLinkAddress>>();
            for (var i = 0; i < groups.Count; i++)
            {
                groups[i].AppendToLinksList(list);
            }
            return list;
        }
    }
}
