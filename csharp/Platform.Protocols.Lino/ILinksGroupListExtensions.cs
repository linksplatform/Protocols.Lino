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
                CollectLinksWithIndentedIdSyntaxSupport(list, groups[i], null);
            }
            return list;
        }

        private static void CollectLinksWithIndentedIdSyntaxSupport<TLinkAddress>(List<Link<TLinkAddress>> list, LinksGroup<TLinkAddress> group, Link<TLinkAddress>? parentDependency)
        {
            var link = group.Link;
            var groups = group.Groups;

            if (groups != null && groups.Count > 0)
            {
                bool isIndentedIdSyntax = link.Id != null &&
                                          (link.Values == null || link.Values.Count == 0) &&
                                          !parentDependency.HasValue;

                if (isIndentedIdSyntax)
                {
                    var childValues = new List<Link<TLinkAddress>>();
                    for (int i = 0; i < groups.Count; i++)
                    {
                        var innerGroup = groups[i];
                        var innerLink = innerGroup.Link;

                        if (innerLink.Values != null && innerLink.Values.Count == 1)
                        {
                            childValues.Add(innerLink.Values[0]);
                        }
                        else if (innerLink.Values != null && innerLink.Values.Count > 1)
                        {
                            childValues.Add(innerLink);
                        }
                        else if (innerLink.Id != null)
                        {
                            childValues.Add(new Link<TLinkAddress>(innerLink.Id));
                        }
                    }

                    var linkWithChildren = new Link<TLinkAddress>(link.Id, childValues);
                    list.Add(linkWithChildren);
                }
                else
                {
                    var currentDependency = parentDependency.HasValue ? parentDependency.Value.Combine(link) : link;
                    list.Add(currentDependency);

                    for (int i = 0; i < groups.Count; i++)
                    {
                        CollectLinksWithIndentedIdSyntaxSupport(list, groups[i], currentDependency);
                    }
                }
            }
            else
            {
                var currentLink = parentDependency.HasValue ? parentDependency.Value.Combine(link) : link;
                list.Add(currentLink);
            }
        }
    }
}
