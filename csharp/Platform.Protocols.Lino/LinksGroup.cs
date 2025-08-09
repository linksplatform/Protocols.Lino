using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using Platform.Collections;
using Platform.Collections.Lists;

namespace Platform.Protocols.Lino
{
    public struct LinksGroup<TLinkAddress> : IEquatable<LinksGroup<TLinkAddress>>
    {
        public Link<TLinkAddress> Link
        {
            [MethodImpl(MethodImplOptions.AggressiveInlining)]
            get;
            [MethodImpl(MethodImplOptions.AggressiveInlining)]
            set;
        }

        public IList<LinksGroup<TLinkAddress>>? Groups
        {
            [MethodImpl(MethodImplOptions.AggressiveInlining)]
            get;
            [MethodImpl(MethodImplOptions.AggressiveInlining)]
            set;
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public LinksGroup(Link<TLinkAddress> link, IList<LinksGroup<TLinkAddress>>? groups)
        {
            Link = link;
            Groups = groups;
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public LinksGroup(Link<TLinkAddress> link) : this(link, null) { }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static implicit operator List<Link<TLinkAddress>>(LinksGroup<TLinkAddress> value) => value.ToLinksList();

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public List<Link<TLinkAddress>> ToLinksList()
        {
            var list = new List<Link<TLinkAddress>>();
            AppendToLinksList(list);
            return list;
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void AppendToLinksList(List<Link<TLinkAddress>> list) => AppendToLinksList(list, Link, this);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static void AppendToLinksList(List<Link<TLinkAddress>> list, Link<TLinkAddress> dependency, LinksGroup<TLinkAddress> group)
        {
            list.Add(dependency);
            var groups = group.Groups;
            if (groups != null && !groups.IsNullOrEmpty())
            {
                for (int i = 0; i < groups.Count; i++)
                {
                    var innerGroup = groups[i];
                    AppendToLinksList(list, dependency.Combine(innerGroup.Link), innerGroup);
                }
            }
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public override bool Equals(object? obj) => obj is LinksGroup<TLinkAddress> linksGroup ? Equals(linksGroup) : false;

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public override int GetHashCode() => (Link, (Groups ?? Array.Empty<LinksGroup<TLinkAddress>>()).GenerateHashCode()).GetHashCode();

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public bool Equals(LinksGroup<TLinkAddress> other) => Link.Equals(other.Link) && (Groups ?? Array.Empty<LinksGroup<TLinkAddress>>()).EqualTo(other.Groups ?? Array.Empty<LinksGroup<TLinkAddress>>());

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static bool operator ==(LinksGroup<TLinkAddress> left, LinksGroup<TLinkAddress> right) => left.Equals(right);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static bool operator !=(LinksGroup<TLinkAddress> left, LinksGroup<TLinkAddress> right) => !(left == right);
    }
}
