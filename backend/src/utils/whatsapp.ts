export interface WhatsAppBookingPayload {
  customerName: string;
  phone: string;
  address: string;
  category: string;
  serviceName: string;
  preferredDate: string;
  preferredTime: string;
  description: string;
  bookingNumber: string;
}

export const formatWhatsAppMessage = (data: WhatsAppBookingPayload): string => {
  const isMultiple = data.serviceName.includes(' • ');
  const serviceSection = isMultiple
    ? `*Services Requested (${data.serviceName.split(' • ').length} Packages):*\n` +
      data.serviceName
        .split(' • ')
        .map((s, idx) => `  ${idx + 1}. ${s.trim()}`)
        .join('\n')
    : `*Service:*\n${data.serviceName}`;

  return `*OMKAR NAGU ELECTRICAL WORKS*
*NEW SERVICE BOOKING*

*Customer Name:* ${data.customerName}
*Phone:* ${data.phone}

*Address:*
${data.address}

*Service Category:*
${data.category}

${serviceSection}

*Preferred Date:*
${data.preferredDate}

*Preferred Time:*
${data.preferredTime}

*Work Description:*
${data.description}

*Booking ID:*
${data.bookingNumber}

_Please contact me regarding this service booking._`;
};

export const getWhatsAppDirectUrl = (phone: string, message: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
};
