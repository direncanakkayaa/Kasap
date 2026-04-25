export type SmsTemplateId = 
  | 'ORDER_CONFIRM_ET' 
  | 'ORDER_CONFIRM_YEMEK' 
  | 'ORDER_CONFIRM_GENEL'
  | 'ORDER_PROCESSING' 
  | 'KURBAN_JOIN' 
  | 'KURBAN_DISTRIBUTION';

export const SmsTemplates: Record<SmsTemplateId, (data: any) => string> = {
  ORDER_CONFIRM_ET: (data) => 
    `Sn. ${data.customerName}, ${data.orderId} numaralı taze et siparişiniz alınmıştır. Erdoğan Kasap kalitesiyle hazırlanıyor.`,
  
  ORDER_CONFIRM_YEMEK: (data) => 
    `Sn. ${data.customerName}, ${data.orderId} numaralı yemek siparişiniz alınmıştır. Ustalarımız hazırlıklara başladı.`,
  
  ORDER_CONFIRM_GENEL: (data) => 
    `Sn. ${data.customerName}, ${data.orderId} numaralı siparişiniz başarıyla oluşturulmuştur. Teşekkür ederiz.`,

  ORDER_PROCESSING: (data) => 
    `Sn. ${data.customerName}, ${data.orderId} numaralı siparişinizin hazırlık ve kesim işlemleri tamamlanmak üzeredir. Afiyet olsun.`,

  KURBAN_JOIN: (data) => 
    `Sn. ${data.customerName}, Kurban hisse kaydınız başarıyla yapılmıştır. Hayırlara vesile olmasını dileriz. Oda: ${data.animalTag}`,

  KURBAN_DISTRIBUTION: (data) => 
    `Sn. ${data.customerName}, kurban hisseniz paylara bölünmüş olup teslimata hazırdır. Dağıtım detaylarını hesabınızdan görebilirsiniz.`,
};
