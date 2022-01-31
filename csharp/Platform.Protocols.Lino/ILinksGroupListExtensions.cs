using System.Collections.Generic;
using System.Runtime.CompilerServices;

#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Platform.Communication.Protocol.Lino
{
    public static class ILinksGroupListExtensions
    {
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static List<Link> ToLinksList(this IList<LinksGroup> groups)
        {
            var list = new List<Link>();
            for (var i = 0; i < groups.Count; i++)
            {
                groups[i].AppendToLinksList(list);
            }
            return list;
        }
    }
}
