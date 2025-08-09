using System.Runtime.CompilerServices;

namespace Platform.Protocols.Lino
{
    public readonly struct id<TLinkAddress>
    {
        public readonly TLinkAddress Id;

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public id(TLinkAddress id) => Id = id;

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static explicit operator id<TLinkAddress>(TLinkAddress id) => new (id);
    }
}
