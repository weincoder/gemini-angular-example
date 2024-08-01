import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  GoogleGenerativeAI, HarmBlockThreshold, HarmCategory
} from '@google/generative-ai';
import { environment } from '../environments/environment.development';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CircularProgressComponent } from './circular-progress/circular-progress.component';


const genAI = new GoogleGenerativeAI(environment.API_KEY);
const generationConfig = {
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ],
  temperature: 0.9,
  top_p: 1,
  top_k: 32,
  maxOutputTokens: 100,
};
const model = genAI.getGenerativeModel({
  model: 'gemini-pro',
  ...generationConfig,
});
const modelVision = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
  ...generationConfig,
});
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CircularProgressComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {

  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    let weincode = `................................................................
    ██╗....██╗███████╗██╗███╗...██╗.██████╗.██████╗.██████╗.███████╗
    ██║....██║██╔════╝██║████╗..██║██╔════╝██╔═══██╗██╔══██╗██╔════╝
    ██║.█╗.██║█████╗..██║██╔██╗.██║██║.....██║...██║██║..██║█████╗..
    ██║███╗██║██╔══╝..██║██║╚██╗██║██║.....██║...██║██║..██║██╔══╝..
    ╚███╔███╔╝███████╗██║██║.╚████║╚██████╗╚██████╔╝██████╔╝███████╗
    .╚══╝╚══╝.╚══════╝╚═╝╚═╝..╚═══╝.╚═════╝.╚═════╝.╚═════╝.╚══════╝
    ................................................................`;
    console.log(weincode);
  }
  title = 'gemini_example_angular';
  respuestaGemini = '';
  respuestaGeminiImagen = '';
  consultarTexto = false;
  consultarImagen = false;
  formularioDePregunta = new FormGroup({
    prompt: new FormControl(''),
  });
  formularioDePreguntaImagen = new FormGroup({
    prompt: new FormControl(''),
  });


  imageReader() {
    const imageUrl = 'assets/images/lior.jpeg'; // Reemplaza con la URL de tu imagen
    this.consultarImagen = true;
    this.http.get(imageUrl, { responseType: 'blob' })
      .subscribe(blob => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64data = reader.result as string;
          const promptText = this.formularioDePreguntaImagen.value.prompt ?? 'Que ves en la imagen?';
          let prompt = [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64data.split(',')[1],
              },
            },
            {
              text: 'Cuentanos sobre esta imagen',
            },
          ];
          const result = await modelVision.generateContent(prompt);
          const response = await result.response;
          this.respuestaGeminiImagen = response.text();
        };
        reader.readAsDataURL(blob);
      });
  }

  async TestGeminiPro() {
    this.consultarTexto = true;
    const prompt = this.formularioDePregunta.value.prompt ?? 'What is the meaning of life?';
    const result = await model.generateContent(prompt);
    const response = await result.response;
    this.respuestaGemini = response.text();
    console.log(response.text());
  }
}


