<template>
  <div class="rounded-lg bg-white p-[1vw]">
    <div ref="QRCODE"></div>
  </div>
</template>
<script lang="ts">
// image: this.$props.image,
// imageOptions: { hideBackgroundDots: false, imageSize: 0.4, margin: 6 },
// { offset: 0, color: "#9475ED" },
//       { offset: 1, color: "#83a7ff" },
// cornersSquareOptions: {
//   type: "extra-rounded" as CornerSquareType,
//   color: "#000000",
//   gradient: {
//     type: "linear" as GradientType,
//     rotation: 0,
//     colorStops: [
//       { offset: 0, color: "#6739da" },
//       { offset: 1, color: "#83a7ff" },
//     ],
//   },
// },
import { defineComponent } from 'vue'
import QRCodeStyling, { DrawType, TypeNumber, Mode, ErrorCorrectionLevel, DotType, CornerSquareType, GradientType, CornerDotType } from 'qr-code-styling'
export default defineComponent({
  props: {
    value: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 300,
    },
  },
  data() {
    const options = {
      width: this.$props.size,
      height: this.$props.size,
      data: this.$props.value,
      type: 'svg' as DrawType,
      qrOptions: {
        typeNumber: 0 as TypeNumber,
        mode: 'Byte' as Mode,
        errorCorrectionLevel: 'Q' as ErrorCorrectionLevel,
      },
      dotsOptions: {
        type: 'rounded' as DotType,
        color: '#4d2c7a',
        gradient: {
          type: 'linear' as GradientType,
          rotation: 0,
          colorStops: [
            { offset: 0, color: '#1e1b4b' },
            { offset: 1, color: '#082f49' },
          ],
        },
      },
      backgroundOptions: { color: '#ffffff' },
      dotsOptionsHelper: {
        colorType: { single: true, gradient: false },
      },
      cornersSquareOptions: {
        type: 'extra-rounded' as CornerSquareType,
        color: '#082f49',
        gradient: {
          type: 'linear' as GradientType,
          rotation: 0,
          colorStops: [
            { offset: 0, color: '#082f49' },
            { offset: 1, color: '#1e1b4b' },
          ],
        },
      },
      cornersSquareOptionsHelper: {
        colorType: { single: true, gradient: false },
        gradient: {
          linear: true,
          radial: false,
          color1: '#1e1b4b',
          color2: '#1e1b4b',
          rotation: 0,
        },
      },
      cornersDotOptions: { type: 'dot' as CornerDotType, color: '#1e1b4b' },
      cornersDotOptionsHelper: {
        colorType: { single: true, gradient: false },
        gradient: {
          linear: true,
          radial: false,
          color1: '#4d2c7a',
          color2: '#4d2c7a',
          rotation: 0,
        },
      },
      backgroundOptionsHelper: {
        colorType: { single: true, gradient: false },
        gradient: {
          linear: true,
          radial: false,
          color1: '#ffffff',
          color2: '#ffffff',
          rotation: 0,
        },
      },
    }
    return {
      options,
      qrCode: new QRCodeStyling(options),
    }
  },
  watch: {
    value(newValue) {
      this.options.data = newValue
      this.qrCode.update(this.options)
      // this.qrCode._options.data = newValue;
    },
  },
  mounted() {
    this.qrCode.append(this.$refs['QRCODE'] || this.$el)
  },
})
</script>
