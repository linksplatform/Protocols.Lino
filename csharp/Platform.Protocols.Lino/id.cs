#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

using System.Runtime.CompilerServices;

namespace Platform.Protocols.Lino
{
    [method: MethodImpl(MethodImplOptions.AggressiveInlining)]
    public readonly struct Id<TLinkAddress>(TLinkAddress id)
    {
        public readonly TLinkAddress id = id;

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static explicit operator Id<TLinkAddress>(TLinkAddress id) => new (id);
    }
}
