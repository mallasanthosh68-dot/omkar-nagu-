import { Booking } from '../types';

export const getBusinessWhatsAppNumber = (): string => {
  const envNum = import.meta.env.VITE_WHATSAPP_NUMBER;
  if (envNum && envNum.trim()) {
    return envNum.replace(/\D/g, '');
  }
  return '919494666420';
};

export const generateWhatsAppMessage = (booking: Booking): string => {
  const isMultiple = booking.serviceName.includes(' • ');
  const serviceSection = isMultiple
    ? `*Services Requested (${booking.serviceName.split(' • ').length} Packages):*\n` +
      booking.serviceName
        .split(' • ')
        .map((s, idx) => `  ${idx + 1}. ${s.trim()}`)
        .join('\n')
    : `*Service:*\n${booking.serviceName}`;

  return `*OMKAR NAGU ELECTRICAL WORKS*
*NEW SERVICE BOOKING*

*Customer Name:* ${booking.customerName}
*Phone:* ${booking.customerPhone}

*Address:*
${booking.address}

*Service Category:*
${booking.category}

${serviceSection}

*Preferred Date:*
${booking.preferredDate}

*Preferred Time:*
${booking.preferredTime}

*Work Description:*
${booking.description}

*Booking ID:*
${booking.bookingNumber}

_Please contact me regarding this service booking._`;
};

export const openWhatsAppBooking = (booking: Booking, customNumber?: string): void => {
  const phone = customNumber ? customNumber.replace(/\D/g, '') : getBusinessWhatsAppNumber();
  const message = generateWhatsAppMessage(booking);
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${phone}?text=${encoded}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};
