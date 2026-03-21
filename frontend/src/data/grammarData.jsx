import React from 'react';

export const STUDY_TIPS = [
  {
    id: 'tip_1',
    title: '1. Học từ các mẫu câu đơn giản',
    content: 'Bắt đầu học ngữ pháp từ những mẫu câu đơn giản giúp bạn xây dựng nền tảng vững chắc và tăng cường sự tự tin. Việc làm quen với các cấu trúc cơ bản như câu khẳng định, phủ định và câu hỏi sẽ giúp bạn hiểu cách các quy tắc ngữ pháp hoạt động trong thực tế. Sau khi thành thạo các câu cơ bản, bạn có thể tiến dần đến những câu phức tạp hơn và mở rộng kiến thức ngữ pháp của mình.'
  },
  {
    id: 'tip_2',
    title: '2. Chấp nhận sai lầm',
    content: 'Hãy nhìn nhận sai sót như một phần không thể thiếu trong quá trình học. Khi bạn chấp nhận sai, bạn sẽ cảm thấy thoải mái hơn khi thử nghiệm với các cấu trúc mới. Tích cực viết và nói dù có thể mắc lỗi, và sau mỗi lỗi, hãy dành thời gian sửa chữa và học hỏi từ chúng. Việc nhận diện và khắc phục lỗi sẽ giúp bạn củng cố kiến thức và nâng cao khả năng sử dụng ngữ pháp chính xác trong tương lai.'
  },
  {
    id: 'tip_3',
    title: '3. Kiên trì và luyện tập đều đặn',
    content: 'Dành thời gian mỗi ngày để học và thực hành giúp bạn củng cố kiến thức và nâng cao kỹ năng dần dần. Xây dựng lịch học đều đặn, dù chỉ vài phút mỗi ngày, sẽ giúp bạn duy trì việc học. Sử dụng các bài tập ngữ pháp, viết câu, và giao tiếp với người khác để áp dụng lý thuyết vào thực tế. Sự kiên trì và luyện tập đều đặn sẽ không chỉ giúp bạn ghi nhớ các quy tắc ngữ pháp mà còn tăng sự tự tin trong việc sử dụng chúng.'
  }
];

const Table = ({ children }) => (
  <div className="overflow-x-auto my-4 rounded-xl border border-white/10">
    <table className="w-full text-sm text-left text-primary-200">
      {children}
    </table>
  </div>
);

const Th = ({ children }) => <th className="px-4 py-3 bg-white/10 font-bold text-white uppercase tracking-wider">{children}</th>;
const Td = ({ children }) => <td className="px-4 py-3 border-t border-white/5 bg-black/20">{children}</td>;

export const ADVANCED_GRAMMAR = [
  {
    id: 'grammar_parts_of_speech',
    name: 'Từ loại (Parts of Speech)',
    content: (
      <div className="space-y-4">
        <p>Từ loại là nền tảng cấu thành nên câu trong tiếng Anh. Các từ loại cơ bản bao gồm:</p>
        <ul className="list-disc list-inside space-y-2 text-primary-200">
          <li><strong className="text-accent-300">Danh từ (Nouns):</strong> Chỉ người, vật, sự việc, khái niệm (VD: teacher, happiness, book). Thường làm chủ ngữ hoặc tân ngữ.</li>
          <li><strong className="text-accent-300">Động từ (Verbs):</strong> Chỉ hành động hoặc trạng thái (VD: run, is, believe). Là phần bắt buộc phải có trong mệnh đề.</li>
          <li><strong className="text-accent-300">Tính từ (Adjectives):</strong> Dùng để miêu tả, cung cấp thông tin cho danh từ (VD: beautiful, fast, red).</li>
          <li><strong className="text-accent-300">Trạng từ (Adverbs):</strong> Bổ nghĩa cho động từ, tính từ hoặc trạng từ khác (VD: quickly, very, well).</li>
          <li><strong className="text-accent-300">Giới từ (Prepositions):</strong> Chỉ nơi chốn, thời gian, sự liên kết (VD: in, on, at, about).</li>
        </ul>
      </div>
    )
  },
  {
    id: 'grammar_relative_clauses',
    name: 'Mệnh đề quan hệ (Relative Clauses)',
    content: (
      <div className="space-y-4">
        <p>Mệnh đề quan hệ dùng để bổ nghĩa cho danh từ đứng trước nó. Được bắt đầu bằng các đại từ/trạng từ quan hệ như Who, Whom, Which, That, Whose, Where, When, Why.</p>
        <h3 className="font-bold text-white mt-4">1. Phân loại Mệnh đề quan hệ:</h3>
        <ul className="list-disc list-inside space-y-2 text-primary-200">
          <li><strong>MĐQH xác định (Defining):</strong> Cung cấp thông tin bắt buộc, không có dấu phẩy. VD: <em className="italic text-primary-300">The man who called you is my uncle.</em></li>
          <li><strong>MĐQH không xác định (Non-defining):</strong> Cung cấp thông tin bổ sung, luôn được đặt giữa hai dấu phẩy, KHÔNG dùng "That". VD: <em className="italic text-primary-300">My father, who is 50, plays tennis.</em></li>
        </ul>
        <h3 className="font-bold text-white mt-4">2. Rút gọn Mệnh đề quan hệ:</h3>
        <ul className="list-disc list-inside space-y-2 text-primary-200">
          <li><strong>Chủ động:</strong> Dùng V-ing. (The man standing there is John.)</li>
          <li><strong>Bị động:</strong> Dùng V3/ed. (The boy injured in the accident was taken to hospital.)</li>
          <li><strong>Dùng To-infinitive:</strong> Sau the first, the last, the only... (He was the first person to arrive.)</li>
        </ul>
      </div>
    )
  },
  {
    id: 'grammar_adverbial_clauses',
    name: 'Mệnh đề trạng ngữ (Adverbial Clauses)',
    content: (
      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-emerald-400">1. Mệnh đề trạng ngữ thời gian</h3>
          <p className="mt-2">Được dùng để chỉ khi nào một hành động xảy ra, kéo dài hoặc kết thúc. Liên từ: <strong>when, while, before, after, as soon as, until</strong>.</p>
          <ul className="list-disc list-inside mt-2 text-primary-300 italic">
            <li>When the bell rang, the students left the classroom.</li>
            <li>I will stay here until you return.</li>
            <li>After she finished her homework, she went to bed.</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-emerald-400">2. Mệnh đề trạng ngữ địa điểm</h3>
          <p className="mt-2">Cho biết nơi một hành động xảy ra. Liên từ: <strong>where, wherever, anywhere</strong>.</p>
          <ul className="list-disc list-inside mt-2 text-primary-300 italic">
            <li>We can rest where the grass is soft.</li>
            <li>Wherever she goes, she makes new friends.</li>
            <li>Anywhere you go, I will follow you.</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-emerald-400">3. Mệnh đề trạng ngữ nguyên nhân</h3>
          <p className="mt-2">Giải thích lý do tại sao sự việc xảy ra. Liên từ: <strong>because, since, as</strong>.</p>
          <ul className="list-disc list-inside mt-2 text-primary-300 italic">
            <li>He didn’t come because he was sick.</li>
            <li>Since the weather was bad, we stayed indoors.</li>
            <li>As it was late, we decided to cancel the meeting.</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-emerald-400">4. Mệnh đề trạng ngữ mục đích</h3>
          <p className="mt-2">Diễn tả lý do hoặc mục tiêu. Liên từ: <strong>so that, in order that</strong>.</p>
          <ul className="list-disc list-inside mt-2 text-primary-300 italic">
            <li>She speaks slowly so that everyone can understand her.</li>
            <li>They trained hard in order that they could win the competition.</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-emerald-400">5. Mệnh đề trạng ngữ kết quả</h3>
          <p className="mt-2">Mô tả hậu quả/kết quả. Liên từ: <strong>so that, so...that, such...that</strong>.</p>
          <ul className="list-disc list-inside mt-2 text-primary-300 italic">
            <li>The music was so loud that we couldn’t hear each other.</li>
            <li>It was such a long journey that we were exhausted.</li>
            <li>He ran so fast that he broke the record.</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'grammar_comparisons',
    name: 'Câu so sánh (Comparison Sentences)',
    content: (
      <div className="space-y-4">
        <p>Câu so sánh (Comparison Sentences) là một dạng câu được dùng để đối chiếu đặc điểm, sự kiện, hoặc hiện tượng khác nhau: so sánh bằng, hơn, và nhất.</p>
        <Table>
          <thead>
            <tr><Th>Loại So Sánh</Th><Th>Cấu Trúc</Th><Th>Ví dụ</Th></tr>
          </thead>
          <tbody>
            <tr>
              <Td><strong className="text-white">So sánh ngang bằng</strong></Td>
              <Td>
                - Tính từ: S + be + as + Adj + as + N/Pronoun<br/>
                - Trạng từ: S + V + as + Adv + as + N/Pronoun
              </Td>
              <Td className="italic text-primary-300">
                - This task is as difficult as the previous one.<br/>
                - He speaks English as fluently as his teacher.
              </Td>
            </tr>
            <tr>
              <Td><strong className="text-white">So sánh hơn</strong></Td>
              <Td>
                - Ngắn: S + V + Adj/Adv-er + than...<br/>
                - Dài: S + V + more/less + Adj/Adv + than...
              </Td>
              <Td className="italic text-primary-300">
                - Mary is taller than her brother.<br/>
                - This smartphone is more expensive than the one I bought last year.
              </Td>
            </tr>
            <tr>
              <Td><strong className="text-white">So sánh nhất</strong></Td>
              <Td>
                - Ngắn: S + V + the + Adj/Adv-est...<br/>
                - Dài: S + V + the most/least + Adj/Adv...
              </Td>
              <Td className="italic text-primary-300">
                - This is the hottest day of the year.<br/>
                - She is the most hardworking student in her class.
              </Td>
            </tr>
          </tbody>
        </Table>
      </div>
    )
  },
  {
    id: 'grammar_reported_speech',
    name: 'Câu tường thuật (Reported Speech)',
    content: (
      <div className="space-y-4">
        <p>Dùng để truyền đạt lại lời nói của ai đó mà không cần lặp lại nguyên văn. Khi động từ tường thuật ở thì quá khứ (ví dụ: said, asked), ta cần lùi thì, đổi đại từ và trạng từ thời gian/nơi chốn.</p>
        
        <h3 className="font-bold text-accent-400 mt-4">1. Quy tắc Lùi Thì</h3>
        <Table>
          <thead>
            <tr><Th>Câu trực tiếp</Th><Th>Câu gián tiếp</Th><Th>Ví dụ</Th></tr>
          </thead>
          <tbody>
            <tr><Td>Present Simple</Td><Td>Past Simple</Td><Td className="italic text-primary-300">"I like coffee." → She said she liked coffee.</Td></tr>
            <tr><Td>Present Continuous</Td><Td>Past Continuous</Td><Td className="italic text-primary-300">"I am studying." → He said he was studying.</Td></tr>
            <tr><Td>Past Simple / Present Perfect</Td><Td>Past Perfect</Td><Td className="italic text-primary-300">"I visited Hanoi." → She said she had visited Hanoi.</Td></tr>
            <tr><Td>Future Simple</Td><Td>Future in the Past (Would)</Td><Td className="italic text-primary-300">"I will call you." → He said he would call me.</Td></tr>
            <tr><Td>Can / May / Must</Td><Td>Could / Might / Had to</Td><Td className="italic text-primary-300">"I can swim." → He said he could swim.</Td></tr>
          </tbody>
        </Table>

        <h3 className="font-bold text-accent-400 mt-4">2. Bảng đổi trạng từ Thời gian - Nơi chốn</h3>
        <Table>
          <thead>
            <tr><Th>Trực tiếp</Th><Th>Gián tiếp</Th><Th>Ví dụ</Th></tr>
          </thead>
          <tbody>
            <tr><Td>This / These</Td><Td>That / Those</Td><Td className="italic text-primary-300">"This is my car" → He said that was his car.</Td></tr>
            <tr><Td>Here / Now</Td><Td>There / Then</Td><Td className="italic text-primary-300">"I am busy now" → He said he was busy then.</Td></tr>
            <tr><Td>Today / Tonight</Td><Td>That day / That night</Td><Td className="italic text-primary-300">"I have an exam today" → She said she had an exam that day.</Td></tr>
            <tr><Td>Yesterday</Td><Td>The day before / The previous day</Td><Td className="italic text-primary-300">"I saw her yesterday" → She said she had seen her the day before.</Td></tr>
            <tr><Td>Tomorrow</Td><Td>The next day / The following day</Td><Td className="italic text-primary-300">"I will travel tomorrow" → He said he would travel the next day.</Td></tr>
            <tr><Td>Ago</Td><Td>Before</Td><Td className="italic text-primary-300">"Two days ago" → Two days before.</Td></tr>
          </tbody>
        </Table>
      </div>
    )
  },
  {
    id: 'grammar_passive_voice',
    name: 'Câu bị động (Passive Voice)',
    content: (
      <div className="space-y-4">
        <p>Câu bị động nhấn mạnh đối tượng bị tác động bởi hành động, thay vì người thực hiện hành động. Công thức chung: <strong>Object + be + V3/ed + (by Subject)</strong>.</p>
        <Table>
          <thead>
            <tr><Th>Thì</Th><Th>Công thức Bị Động</Th><Th>Ví dụ</Th></tr>
          </thead>
          <tbody>
            <tr><Td>Present Simple</Td><Td>am/is/are + V3/ed</Td><Td className="italic text-primary-300">"He writes a poem." → A poem is written (by him).</Td></tr>
            <tr><Td>Present Continuous</Td><Td>am/is/are + being + V3/ed</Td><Td className="italic text-primary-300">"He is repairing the truck." → The truck is being repaired.</Td></tr>
            <tr><Td>Present Perfect</Td><Td>have/has + been + V3/ed</Td><Td className="italic text-primary-300">"They have finished." → The exercises have been finished.</Td></tr>
            <tr><Td>Past Simple</Td><Td>was/were + V3/ed</Td><Td className="italic text-primary-300">"They built the street." → The street was built.</Td></tr>
            <tr><Td>Past Continuous</Td><Td>was/were + being + V3/ed</Td><Td className="italic text-primary-300">"They were discussing the topic." → The topic was being discussed.</Td></tr>
            <tr><Td>Past Perfect</Td><Td>had + been + V3/ed</Td><Td className="italic text-primary-300">"She had completed the work." → The work had been completed.</Td></tr>
            <tr><Td>Future Simple</Td><Td>will + be + V3/ed</Td><Td className="italic text-primary-300">"They will deliver the mail." → The mail will be delivered.</Td></tr>
            <tr><Td>Near Future</Td><Td>is/am/are + going to be + V3/ed</Td><Td className="italic text-primary-300">"They are going to finish the project." → The project is going to be finished.</Td></tr>
            <tr><Td>Future Perfect</Td><Td>will have + been + V3/ed</Td><Td className="italic text-primary-300">"Linda will have finished." → The assignment will have been finished.</Td></tr>
          </tbody>
        </Table>
      </div>
    )
  },
  {
    id: 'grammar_cleft_sentences',
    name: 'Câu chẻ (Cleft Sentences)',
    content: (
      <div className="space-y-4">
        <p>Câu chẻ dùng để làm nổi bật (nhấn mạnh) một phần cụ thể trong câu như chủ ngữ, tân ngữ, trạng từ. Công thức nhấn mạnh bằng <strong>"It is/was ... that/who ..."</strong>.</p>
        <Table>
          <thead>
            <tr><Th>Nhấn mạnh</Th><Th>Cấu trúc</Th><Th>Ví dụ</Th></tr>
          </thead>
          <tbody>
            <tr><Td>Chủ ngữ</Td><Td>It is/was + S + who/that + V</Td><Td className="italic text-primary-300">It was Sherry who fixed the motorbike.<br/>It is the lesson that inspired the audiences.</Td></tr>
            <tr><Td>Tân ngữ</Td><Td>It is/was + O + that/whom + S + V</Td><Td className="italic text-primary-300">It was Linda that Sarah invited to the party.<br/>It was the picture that Sarah painted.</Td></tr>
            <tr><Td>Trạng ngữ</Td><Td>It is/was + Trạng ngữ + that + S + V + O</Td><Td className="italic text-primary-300">It was last night that they met at the restaurant.<br/>It was for better jobs that Helen moved.</Td></tr>
            <tr><Td>Dùng "What" / "All"</Td><Td>What / All + S + V + is/was + Ý nhấn mạnh</Td><Td className="italic text-primary-300">What the team needs is more time.<br/>All Sarah wants is to spend time with her family.</Td></tr>
          </tbody>
        </Table>
      </div>
    )
  },
  {
    id: 'grammar_conditionals',
    name: 'Câu điều kiện (Conditional Sentences)',
    content: (
      <div className="space-y-4">
        <p>Câu điều kiện diễn tả một tình huống giả định (if-clause) và kết quả (main clause).</p>
        <Table>
          <thead>
            <tr><Th>Loại</Th><Th>Công Thức (If + Điều kiện, Kết quả)</Th><Th>Ví dụ</Th></tr>
          </thead>
          <tbody>
            <tr><Td>Loại 0 (Sự thật)</Td><Td>If + Hiện Thại Đơn, Hiện Tại Đơn</Td><Td className="italic text-primary-300">If you mix red and blue, you get purple.</Td></tr>
            <tr><Td>Loại 1 (Có thể Xảy ra)</Td><Td>If + Hiện Tại Đơn, S + will/can + V</Td><Td className="italic text-primary-300">If she studies hard, she will pass the exam.</Td></tr>
            <tr><Td>Loại 2 (Không có thật ở HT)</Td><Td>If + Quá Khứ Đơn, S + would/could + V</Td><Td className="italic text-primary-300">If I had a car, I would drive to the beach.<br/>(Với Tobe, dùng 'were' cho mọi chủ ngữ)</Td></tr>
            <tr><Td>Loại 3 (Không có thật ở QK)</Td><Td>If + Quá Khứ Hoàn Thành, S + would have + V3</Td><Td className="italic text-primary-300">If he had worked harder, he would have been promoted.</Td></tr>
            <tr><Td>Hỗn hợp (Mix 3-2)</Td><Td>If + QK Hoàn Thành, S + would + V (now)</Td><Td className="italic text-primary-300">If I had known, I would be attending it now.</Td></tr>
            <tr><Td>Hỗn hợp (Mix 2-3)</Td><Td>If + QK Đơn, S + would have + V3</Td><Td className="italic text-primary-300">If they had booked earlier, they would have gotten a better price.</Td></tr>
          </tbody>
        </Table>
      </div>
    )
  },
  {
    id: 'grammar_tag_questions',
    name: 'Câu hỏi đuôi (Tag Questions)',
    content: (
      <div className="space-y-4">
        <p>Câu hỏi đuôi là dạng Yes-No ngắn gọn đứng cuối câu để xác nhận thông tin. <strong>Nguyên tắc: Mệnh đề trước khẳng định {'->'} Đuôi phủ định, và ngược lại.</strong></p>
        <Table>
          <thead>
            <tr><Th>Thì / Dạng</Th><Th>Cấu trúc Đuôi</Th><Th>Ví dụ</Th></tr>
          </thead>
          <tbody>
            <tr><Td>Hiện tại đơn (To Be)</Td><Td>isn’t/aren’t/am I not + S?</Td><Td className="italic text-primary-300">It's hot today, isn’t it?<br/>They are on holiday, aren’t they?</Td></tr>
            <tr><Td>Hiện tại đơn (Động từ)</Td><Td>don’t/doesn’t + S?</Td><Td className="italic text-primary-300">He likes to sing, doesn’t he?<br/>She doesn't understand, does she?</Td></tr>
            <tr><Td>Quá khứ đơn</Td><Td>wasn’t/weren’t/didn’t + S?</Td><Td className="italic text-primary-300">The weather was nice, wasn’t it?<br/>She finished on time, didn’t she?</Td></tr>
            <tr><Td>Tương lai đơn (Will)</Td><Td>won’t / will + S?</Td><Td className="italic text-primary-300">You will join us, won’t you?<br/>Sherry won’t be late, will she?</Td></tr>
            <tr><Td>Hoàn thành (Have/Has/Had)</Td><Td>haven’t/hasn’t/hadn’t + S?</Td><Td className="italic text-primary-300">They have visited before, haven’t they?<br/>Selena hadn’t finished, had she?</Td></tr>
            <tr><Td>Khuyết thiếu (Can, Should...)</Td><Td>modal + (not) + S?</Td><Td className="italic text-primary-300">You couldn’t solve it, could you?<br/>Tom should be there, shouldn’t he?</Td></tr>
          </tbody>
        </Table>
      </div>
    )
  },
  {
    id: 'grammar_perfect_modals',
    name: 'Động từ khuyết thiếu hoàn thành (Perfect Modals)',
    content: (
      <div className="space-y-4">
        <p>Perfect modals dùng để diễn tả khả năng, suy đoán, hoặc nhận định về sự việc đã xảy ra trong quá khứ. Công thức: <strong>Modal + have + V3/ed</strong>.</p>
        <Table>
          <thead>
            <tr><Th>Cấu trúc</Th><Th>Cách sử dụng</Th><Th>Ví dụ</Th></tr>
          </thead>
          <tbody>
            <tr><Td>Should (not) have + V3</Td><Td>Lẽ ra (không) nên làm nhưng đã làm/không làm ở quá khứ.</Td><Td className="italic text-primary-300">They should have arrived earlier to avoid the traffic.</Td></tr>
            <tr><Td>Would (not) have + V3</Td><Td>Có lẽ sẽ xảy ra nếu điều kiện thỏa mãn, người nói muốn nhưng không làm.</Td><Td className="italic text-primary-300">I would have gone if I hadn’t had other plans.</Td></tr>
            <tr><Td>Must have + V3</Td><Td>Xác tín chắn chắn 1 việc ĐÃ xảy ra trong QK (Suy luận logic).</Td><Td className="italic text-primary-300">She must have forgotten our appointment.</Td></tr>
            <tr><Td>Can't have + V3</Td><Td>Chắc chắn 1 việc KHÔNG THỂ xảy ra ở QK.</Td><Td className="italic text-primary-300">He can’t have missed the bus; he was right here.</Td></tr>
            <tr><Td>Could / Might have + V3</Td><Td>Có lẽ đã xảy ra, nhưng không chắc chắn (Suy đoán yếu).</Td><Td className="italic text-primary-300">I might have left my wallet in the car. Let me check.</Td></tr>
            <tr><Td>Needn't have + V3</Td><Td>Lẽ ra không cần làm điều vô ích đó trong QK.</Td><Td className="italic text-primary-300">You needn’t have worried; you passed with flying colors.</Td></tr>
          </tbody>
        </Table>
      </div>
    )
  }
];
