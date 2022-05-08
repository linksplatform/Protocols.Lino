#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

using System.Runtime.CompilerServices;

namespace Platform.Protocols.Lino
{
    public struct _<TLinkAddress>
    {
        public readonly Link<TLinkAddress> Link;

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public _(Link<TLinkAddress> id) => Link = id;

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static implicit operator _<TLinkAddress>(Link<TLinkAddress> value) => new (value);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static implicit operator _<TLinkAddress>(TLinkAddress id) => new (id);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static implicit operator _<TLinkAddress>((TLinkAddress, Link<TLinkAddress>) value) => new Link<TLinkAddress>(value.Item1, new [] { value.Item2 });

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static implicit operator _<TLinkAddress>((TLinkAddress, Link<TLinkAddress>, Link<TLinkAddress>) value) => new Link<TLinkAddress>(value.Item1, new [] { value.Item2, value.Item3 });

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static implicit operator _<TLinkAddress>((TLinkAddress, Link<TLinkAddress>, Link<TLinkAddress>, Link<TLinkAddress>) value) => new Link<TLinkAddress>(value.Item1, new [] { value.Item2, value.Item3, value.Item4 });

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static implicit operator Link<TLinkAddress>(_<TLinkAddress> value) => value.Link;
    }
}
