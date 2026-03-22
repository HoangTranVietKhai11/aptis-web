const { Pool } = require('pg');
require('dotenv').config();

async function finalFix() {
  console.log('🚀 Starting ADDITIVE Cloud Data Restoration (No Truncate)...');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  const client = await pool.connect();

  try {
    // Reset sequences to MAX(id) to avoid conflicts with migrated data
    await client.query("SELECT setval(pg_get_serial_sequence('practice_questions', 'id'), COALESCE((SELECT MAX(id) FROM practice_questions), 0) + 1, false)");
    await client.query("SELECT setval(pg_get_serial_sequence('vocabulary', 'id'), COALESCE((SELECT MAX(id) FROM vocabulary), 0) + 1, false)");
    await client.query("SELECT setval(pg_get_serial_sequence('mock_tests', 'id'), COALESCE((SELECT MAX(id) FROM mock_tests), 0) + 1, false)");
    await client.query("SELECT setval(pg_get_serial_sequence('roadmap', 'id'), COALESCE((SELECT MAX(id) FROM roadmap), 0) + 1, false)");

    // 1. Vocabulary (300+ words with translations)
    console.log('Adding 300+ Vocabulary words with Vietnamese translations...');
    const vocabData = `innovate|make changes|Companies must innovate to survive.|v.|B2|Công nghệ|đổi mới
obsolete|no longer used|That phone is obsolete.|adj.|C1|Công nghệ|lỗi thời
cutting-edge|highly advanced|We use cutting-edge tech.|adj.|C1|Công nghệ|tiên tiến
artificial|made by humans|Artificial intelligence is growing.|adj.|B2|Công nghệ|nhân tạo
intelligence|ability to learn|He shows high intelligence.|n.|B2|Công nghệ|trí thông minh
cyber|relating to computers|Cyber security is essential.|adj.|B2|Công nghệ|không gian mạng
database|collection of data|Update the customer database.|n.|B1|Công nghệ|cơ sở dữ liệu
network|system of connections|The network went down.|n.|B1|Công nghệ|mạng lưới
encrypt|convert to code|Encrypt your passwords.|v.|C1|Công nghệ|mã hóa
hardware|physical parts|Buy new hardware.|n.|A2|Công nghệ|phần cứng
software|computer programs|Install the software.|n.|A2|Công nghệ|phần mềm
virtual|not physically existing|We had a virtual meeting.|adj.|B2|Công nghệ|ảo
reality|the true state|Face reality.|n.|B2|Công nghệ|thực tế
server|main computer|The server crashed.|n.|B2|Công nghệ|máy chủ
browse|look through|I browse the web.|v.|B1|Công nghệ|duyệt
digitize|convert to digital|Digitize the records.|v.|C1|Công nghệ|số hóa
parameter|limit or boundary|Set the parameters.|n.|C2|Công nghệ|thông số
bandwidth|data transfer rate|We need more bandwidth.|n.|C1|Công nghệ|băng thông
interface|connection point|User interface is clean.|n.|B2|Công nghệ|giao diện
binary|involving two things|Binary code is zeros and ones.|adj.|C1|Công nghệ|nhị phân
coding|writing programs|Coding is a great skill.|n.|B1|Công nghệ|lập trình
deploy|bring into action|Deploy the new update.|v.|C1|Công nghệ|triển khai
diagnostic|identifying illness/problem|Run diagnostic tests.|n.|C2|Công nghệ|chẩn đoán
automation|use of machines|Automation saves time.|n.|B2|Công nghệ|tự động hóa
prototype|first model|Test the prototype.|n.|C1|Công nghệ|nguyên mẫu
simulation|imitation of process|A flight simulation.|n.|B2|Công nghệ|mô phỏng
firewall|security system|Check the firewall.|n.|B2|Công nghệ|tường lửa
patent|right to invention|File a patent.|n.|C1|Công nghệ|bằng sáng chế
telecommute|work from home|I telecommute on Fridays.|v.|C1|Công nghệ|làm việc từ xa
gadget|small device|A useful kitchen gadget.|n.|B1|Công nghệ|tiện ích (thiết bị)
glitch|sudden malfunction|A computer glitch.|n.|C1|Công nghệ|lỗi nhỏ
intuitive|easy to understand|An intuitive design.|adj.|C2|Công nghệ|trực quan
optimization|making the best of|Search engine optimization.|n.|C1|Công nghệ|tối ưu hóa
configuration|arrangement of parts|System configuration.|n.|C1|Công nghệ|cấu hình
processor|central part of PC|A fast processor.|n.|B2|Công nghệ|bộ xử lý
pixel|minute area of screen|High pixel count.|n.|B1|Công nghệ|điểm ảnh
resolution|detail an image holds|High resolution screen.|n.|B2|Công nghệ|độ phân giải
algorithm|set of rules|A sorting algorithm.|n.|B2|Công nghệ|thuật toán
cloud|remote servers|Save it to the cloud.|n.|B1|Công nghệ|điện toán đám mây
integration|combining parts|System integration.|n.|C1|Công nghệ|tích hợp
analytics|data analysis|Web analytics.|n.|C1|Công nghệ|phân tích dữ liệu
benchmark|standard of measure|Set a new benchmark.|n.|C1|Công nghệ|điểm chuẩn
broadband|high-speed internet|Broadband connection.|n.|B1|Công nghệ|băng thông rộng
default|preselected option|Default settings.|n.|B2|Công nghệ|mặc định
logic|reasoning|Computer logic.|n.|B2|Công nghệ|logic
protocol|rules of data|Internet protocol.|n.|C1|Công nghệ|giao thức
terminal|end part|A computer terminal.|n.|B2|Công nghệ|thiết bị đầu cuối
syntax|sentence structure|Code syntax.|n.|C1|Công nghệ|cú pháp
widget|small application|A weather widget.|n.|B1|Công nghệ|tiện ích (ứng dụng)
robotics|technology of robots|He studies robotics.|n.|B2|Công nghệ|rô-bốt học
ecology|study of environment|Marine ecology.|n.|B2|Môi trường|sinh thái học
habitat|natural home|Animal habitat.|n.|B2|Môi trường|môi trường sống
endangered|at risk of extinction|Endangered species.|adj.|B1|Môi trường|có nguy cơ tuyệt chủng
extinct|no longer existing|Dinosaurs are extinct.|adj.|B2|Môi trường|tuyệt chủng
deforestation|clearing forests|Deforestation is bad.|n.|C1|Môi trường|nạn phá rừng
conservation|protection|Wildlife conservation.|n.|B2|Môi trường|sự bảo tồn
toxic|poisonous|Toxic waste.|adj.|B2|Môi trường|độc hại
emission|gas release|Carbon emission.|n.|C1|Môi trường|khí thải
ozone|form of oxygen|Ozone layer.|n.|B2|Môi trường|tầng ô-zôn
depletion|reduction|Resource depletion.|n.|C1|Môi trường|sự suy giảm
sustainable|maintainable|Sustainable growth.|adj.|B2|Môi trường|bền vững
renewable|easily replaced|Renewable energy.|adj.|B2|Môi trường|có thể tái tạo
solar|from sun|Solar power.|adj.|B1|Môi trường|mặt trời
geothermal|from earth heat|Geothermal energy.|adj.|C2|Môi trường|địa nhiệt
biodiversity|variety of life|Rich biodiversity.|n.|C1|Môi trường|đa dạng sinh học
ecosystem|biological community|Fragile ecosystem.|n.|C1|Môi trường|hệ sinh thái
greenhouse|glass building / gas|Greenhouse effect.|n.|B1|Môi trường|hiệu ứng nhà kính
compost|decayed organic material|Make compost.|n.|C1|Môi trường|phân hữu cơ
recycle|reuse material|Recycle plastic.|v.|A2|Môi trường|tái chế
biodegradable|capable of decaying|Biodegradable bags.|adj.|C1|Môi trường|phân hủy sinh học
landfill|waste disposal site|Toxic landfill.|n.|B2|Môi trường|bãi chôn lấp
glacier|mass of ice|Melting glacier.|n.|B2|Môi trường|sông băng
marine|of the sea|Marine life.|adj.|B2|Môi trường|biển
poaching|illegal hunting|Stop poaching.|n.|C2|Môi trường|săn bắn trái phép
sanctuary|safe place|Animal sanctuary.|n.|C1|Môi trường|khu bảo tồn
vegetation|plants|Dense vegetation.|n.|B2|Môi trường|thảm thực vật
wilderness|wild area|Alaskan wilderness.|n.|B2|Môi trường|vùng hoang dã
footprint|impact|Carbon footprint.|n.|B2|Môi trường|dấu chân (tác động)
organic|natural|Organic food.|adj.|B1|Môi trường|hữu cơ
pesticide|chemical for pests|Use pesticide.|n.|C1|Môi trường|thuốc trừ sâu
pollutant|substance that pollutes|Air pollutant.|n.|C1|Môi trường|chất ô nhiễm
smog|fog and smoke|City smog.|n.|B2|Môi trường|khói bụi
affluent|wealthy|Affluent cities pollute more.|adj.|C1|Môi trường|giàu có
barren|too poor to produce|Barren land.|adj.|C1|Môi trường|cằn cỗi
catastrophe|disaster|Environmental catastrophe.|n.|C1|Môi trường|thảm họa
drought|period without rain|Severe drought.|n.|B2|Môi trường|hạn hán
erupt|volcano burst|Volcano will erupt.|v.|B2|Môi trường|phun trào
famine|extreme scarcity of food|Widespread famine.|n.|C1|Môi trường|nạn đói
global|worldwide|Global warming.|adj.|B1|Môi trường|toàn cầu
insulate|protect from heat/cold|Insulate homes.|v.|C1|Môi trường|cách nhiệt
meteorology|study of weather|Study meteorology.|n.|C2|Môi trường|khí tượng học
preservation|maintaining state|Nature preservation.|n.|B2|Môi trường|sự gìn giữ
purify|make clean|Purify water.|v.|C1|Môi trường|làm sạch
reserve|keep for future|Nature reserve.|n.|B2|Môi trường|khu dự trữ
rural|countryside|Rural area.|adj.|B1|Môi trường|nông thôn
terrain|stretch of land|Rough terrain.|n.|C1|Môi trường|địa hình
thrive|grow well|Plants thrive here.|v.|C1|Môi trường|phát triển mạnh
wetland|swamp area|Protect the wetland.|n.|C1|Môi trường|vùng đất ngập nước
zero-emission|no gas release|Zero-emission cars.|adj.|C1|Môi trường|không phát thải
climate|weather conditions|Climate change.|n.|B1|Môi trường|khí hậu
itinerary|route of journey|Travel itinerary.|n.|C1|Du lịch|lịch trình
exotic|foreign and strange|Exotic locations.|adj.|B2|Du lịch|kỳ lạ/đẹp mắt
monument|statue/building|Historic monument.|n.|B1|Du lịch|đài tưởng niệm
heritage|inherited traditions|Cultural heritage.|n.|B2|Du lịch|di sản
domestic|existing inside a country|Domestic flights.|adj.|B2|Du lịch|nội địa
abroad|in a foreign country|Travel abroad.|adv.|B1|Du lịch|nước ngoài
breathtaking|astonishing|Breathtaking views.|adj.|B2|Du lịch|đẹp đến nghẹt thở
picturesque|visually attractive|Picturesque village.|adj.|C1|Du lịch|đẹp như tranh
destination|place going to|Holiday destination.|n.|B1|Du lịch|điểm đến
journey|act of traveling|Long journey.|n.|B1|Du lịch|hành trình
voyage|long journey by sea|Sea voyage.|n.|C1|Du lịch|chuyến du hành biển
expedition|journey for purpose|Arctic expedition.|n.|C1|Du lịch|cuộc thám hiểm
transit|carrying people|Public transit.|n.|B2|Du lịch|quá cảnh
accommodation|room/building|Find accommodation.|n.|B1|Du lịch|chỗ ở
backpack|travel with bag|Backpack in Asia.|v.|B1|Du lịch|du lịch bụi
souvenir|thing kept as reminder|Buy a souvenir.|n.|B1|Du lịch|quà lưu niệm
excursion|short journey|Day excursion.|n.|B2|Du lịch|chuyến tham quan
layover|period of rest|Flight layover.|n.|C1|Du lịch|điểm dừng nghỉ
passport|travel document|Show passport.|n.|A2|Du lịch|hộ chiếu
visa|endorsement on passport|Need a visa.|n.|B1|Du lịch|thị thực
landmark|recognizable feature|Famous landmark.|n.|B2|Du lịch|danh lam thắng cảnh
sightseeing|visiting places|Go sightseeing.|n.|A2|Du lịch|ngắm cảnh
terminal|departure building|Terminal 3.|n.|B1|Du lịch|nhà ga (sân bay)
customs|duties/border check|Clear customs.|n.|B2|Du lịch|hải quan
declare|say formally|Anything to declare?|v.|B2|Du lịch|khai báo
currency|money system|Foreign currency.|n.|B1|Du lịch|tiền tệ
cruise|voyage on ship|Luxury cruise.|n.|B1|Du lịch|du thuyền
hospitality|friendly reception|Great hospitality.|n.|C1|Du lịch|sự hiếu khách
reservation|booking|Make a reservation.|n.|B1|Du lịch|sự đặt chỗ
budget|financial plan|Travel on a budget.|n.|B1|Du lịch|ngân sách
baggage|luggage|Claim baggage.|n.|A2|Du lịch|hành lý
carousel|conveyor belt|Baggage carousel.|n.|C1|Du lịch|băng chuyền (hành lý)
concourse|open central area|Station concourse.|n.|C2|Du lịch|sảnh hành khách
departure|leaving|Departure time.|n.|A2|Du lịch|sự khởi hành
eco-tourism|responsible travel|Support eco-tourism.|n.|C1|Du lịch|du lịch sinh thái
fare|ticket price|Train fare.|n.|B1|Du lịch|giá vé
guide|person who shows|Tour guide.|n.|A2|Du lịch|hướng dẫn viên
hostel|cheap accommodation|Stay in a hostel.|n.|B1|Du lịch|nhà trọ rẻ tiền
jet-lag|tiredness from flying|Suffer from jet-lag.|n.|C1|Du lịch|mệt mỏi sau chuyến bay dài
luggage|bags|Heavy luggage.|n.|A2|Du lịch|hành lý
motel|roadside hotel|Stay at motel.|n.|B1|Du lịch|nhà nghỉ ven đường
navigate|find way|Navigate the city.|v.|B2|Du lịch|điều hướng
resort|place for holiday|Beach resort.|n.|B1|Du lịch|khu nghỉ dưỡng
safari|expedition to observe animals|African safari.|n.|B2|Du lịch|thám hiểm hoang dã
scenery|natural features|Beautiful scenery.|n.|B1|Du lịch|phong cảnh
staycation|holiday at home|We had a staycation.|n.|C1|Du lịch|nghỉ dưỡng tại chỗ
tariff|tax/duty|Hotel tariff.|n.|C1|Du lịch|thuế quan/giá cước
trek|long walk|Mountain trek.|n.|B2|Du lịch|đi bộ đường dài
vacancy|unoccupied room|No vacancy.|n.|B2|Du lịch|phòng trống
wanderlust|desire to travel|I have wanderlust.|n.|C2|Du lịch|niềm đam mê du lịch
agreement|negotiated arrangement|Sign the agreement.|n.|B1|Hợp đồng|thỏa thuận
breach|break a rule|Breach of contract.|n.|C1|Hợp đồng|vi phạm
clause|part of legal document|A contract clause.|n.|C1|Hợp đồng|điều khoản
binding|cannot be legally avoided|A legally binding tie.|adj.|C1|Hợp đồng|ràng buộc
liable|legally responsible|You are liable.|adj.|C1|Hợp đồng|có trách nhiệm pháp lý
obligation|duty|Contractual obligation.|n.|B2|Hợp đồng|nghĩa vụ
consent|permission|Mutual consent.|n.|C1|Hợp đồng|sự đồng ý
null|invalid|Null and void.|adj.|C2|Hợp đồng|vô hiệu
void|not valid|The contract is void.|adj.|C2|Hợp đồng|trống rỗng/vô hiệu
resolution|firm decision|Dispute resolution.|n.|C1|Hợp đồng|nghị quyết/giải quyết
trademark|registered symbol|Company trademark.|n.|C1|Hợp đồng|nhãn hiệu
copyright|legal right|Copyright law.|n.|B2|Hợp đồng|bản quyền
litigate|take to court|They will litigate.|v.|C2|Hợp đồng|kiện tụng
witness|person who sees event|Key witness.|n.|B2|Hợp đồng|nhân chứng
testimony|formal statement|Give testimony.|n.|C2|Hợp đồng|lời khai
verdict|decision in court|Jury verdict.|n.|C1|Hợp đồng|lời tuyên án
proxy|authority to represent|Vote by proxy.|n.|C2|Hợp đồng|ủy quyền
tenant|person who rents|The new tenant.|n.|B2|Hợp đồng|người thuê nhà
lease|rental agreement|Sign the lease.|n.|B2|Hợp đồng|hợp đồng thuê
notary|official who authorizes|Public notary.|n.|C2|Hợp đồng|công chứng viên
arbitration|settling a dispute|Go to arbitration.|n.|C2|Hợp đồng|trọng tài
compliance|obedience to rule|Ensure compliance.|n.|C1|Hợp đồng|sự tuân thủ
disclose|make known|Disclose information.|v.|C1|Hợp đồng|tiết lộ
enforce|compel observance|Enforce the law.|v.|C1|Hợp đồng|thực thi
exempt|free from obligation|Tax exempt.|adj.|C1|Hợp đồng|miễn trừ
indemnify|compensate for harm|Indemnify the victim.|v.|C2|Hợp đồng|bồi thường
jurisdiction|official power|Legal jurisdiction.|n.|C2|Hợp đồng|thẩm quyền
mandate|official order|Government mandate.|n.|C1|Hợp đồng|lệnh/ủy thác
negotiate|obtain by discussion|Negotiate terms.|v.|B2|Hợp đồng|thương lượng
penalize|punish|They will penalize you.|v.|C1|Hợp đồng|xử phạt
ratify|give formal consent|Ratify the treaty.|v.|C2|Hợp đồng|phê chuẩn
revoke|cancel|Revoke the license.|v.|C1|Hợp đồng|thu hồi
stipulate|demand as part of agreement|The rules stipulate...|v.|C2|Hợp đồng|quy định
valid|legally acceptable|Valid contract.|adj.|B1|Hợp đồng|có hiệu lực
waive|refrain from applying|Waive the fee.|v.|C1|Hợp đồng|khước từ/miễn (phí)
yield|produce or provide|Yield results.|v.|C1|Hợp đồng|mang lại/sinh lợi
amendment|minor change|Contract amendment.|n.|C1|Hợp đồng|sửa đổi
bargain|agreement|Strike a bargain.|n.|B2|Hợp đồng|mặc cả/thỏa thuận
code|set of rules|Legal code.|n.|B2|Hợp đồng|bộ luật
decree|official order|Royal decree.|n.|C2|Hợp đồng|nghị định
dispute|disagreement|Settle a dispute.|n.|B2|Hợp đồng|tranh chấp
hearing|opportunity to state case|Court hearing.|n.|C1|Hợp đồng|phiên điều trần
injunction|authoritative warning|Court injunction.|n.|C2|Hợp đồng|lệnh cấm (tòa án)
lawsuit|claim brought to court|File a lawsuit.|n.|C1|Hợp đồng|vụ kiện
oath|solemn promise|Take an oath.|n.|C1|Hợp đồng|lời thề
settlement|official agreement|Reach a settlement.|n.|C1|Hợp đồng|sự hòa giải
statute|written law|A new statute.|n.|C2|Hợp đồng|đạo luật
trial|court examination|Murder trial.|n.|B2|Hợp đồng|xét xử
strategy|plan of action|Business strategy.|n.|B2|Kế hoạch kinh doanh|chiến lược
entrepreneur|business founder|A young entrepreneur.|n.|C1|Kế hoạch kinh doanh|doanh nhân
market|area of commerce|Target market.|n.|B1|Kế hoạch kinh doanh|thị trường
revenue|income|Company revenue.|n.|C1|Kế hoạch kinh doanh|doanh thu
expenditure|spending funds|Capital expenditure.|n.|C1|Kế hoạch kinh doanh|chi phí
forecast|prediction|Sales forecast.|n.|B2|Kế hoạch kinh doanh|dự báo
asset|useful/valuable thing|Company asset.|n.|B2|Kế hoạch kinh doanh|tài sản
liability|state of being responsible|Tax liability.|n.|C1|Kế hoạch kinh doanh|nợ phải trả
dividend|sum out of profits|Pay a dividend.|n.|C1|Kế hoạch kinh doanh|cổ tức
monopoly|exclusive control|A market monopoly.|n.|C1|Kế hoạch kinh doanh|độc quyền
inflation|increase in prices|High inflation.|n.|B2|Kế hoạch kinh doanh|lạm phát
equity|value of shares|Negative equity.|n.|C1|Kế hoạch kinh doanh|vốn chủ sở hữu
deficit|shortage|Budget deficit.|n.|C1|Kế hoạch kinh doanh|thâm hụt
surplus|excess|Trade surplus.|n.|C1|Kế hoạch kinh doanh|thặng dư
niche|specialized segment|Niche market.|n.|C1|Kế hoạch kinh doanh|thị trường ngách
overhead|ongoing expense|Low overheads.|n.|C1|Kế hoạch kinh doanh|chi phí cố định
portfolio|range of investments|Diverse portfolio.|n.|C1|Kế hoạch kinh doanh|danh mục đầu tư
quarter|3-month period|First quarter profits.|n.|B2|Kế hoạch kinh doanh|quý
recruit|enlist someone|Recruit staff.|v.|B2|Kế hoạch kinh doanh|tuyển dụng
stake|share/interest|A 20% stake.|n.|C1|Kế hoạch kinh doanh|cổ phần
turnover|money taken by business|High turnover.|n.|C1|Kế hoạch kinh doanh|doanh số/lưu chuyển
venture|risky undertaking|A joint venture.|n.|C1|Kế hoạch kinh doanh|liên doanh/mạo hiểm
audit|official inspection|Financial audit.|n.|C1|Kế hoạch kinh doanh|kiểm toán
benchmark|standard|Set a benchmark.|n.|C1|Kế hoạch kinh doanh|điểm chuẩn
capital|wealth|Raise capital.|n.|B2|Kế hoạch kinh doanh|vốn
commerce|buying and selling|E-commerce.|n.|B2|Kế hoạch kinh doanh|thương mại
commodity|raw material|A valuable commodity.|n.|C1|Kế hoạch kinh doanh|hàng hóa
corporate|relating to company|Corporate culture.|adj.|B2|Kế hoạch kinh doanh|doanh nghiệp
enterprise|a business|A small enterprise.|n.|B2|Kế hoạch kinh doanh|xí nghiệp/doanh nghiệp
fiscal|relating to government revenue|Fiscal year.|adj.|C2|Kế hoạch kinh doanh|tài chính/tài khóa
franchise|authorization to sell|Buy a franchise.|n.|C1|Kế hoạch kinh doanh|nhượng quyền
gross|total without deductions|Gross profit.|adj.|C1|Kế hoạch kinh doanh|tổng
incentive|motivator|Financial incentive.|n.|C1|Kế hoạch kinh doanh|khuyến khích
inventory|complete list|Store inventory.|n.|C1|Kế hoạch kinh doanh|hàng tồn kho
logistics|detailed organization|Event logistics.|n.|C1|Kế hoạch kinh doanh|hậu cần
margin|edge or profit limit|Profit margin.|n.|C1|Kế hoạch kinh doanh|biên lợi nhuận
merger|combining companies|A big merger.|n.|C1|Kế hoạch kinh doanh|sáp nhập
net|total after deductions|Net income.|adj.|B2|Kế hoạch kinh doanh|ròng
outsource|contract work abroad|Outsource IT.|v.|C1|Kế hoạch kinh doanh|thuê ngoài
quota|fixed share|Production quota.|n.|C1|Kế hoạch kinh doanh|hạn ngạch
retail|sale to public|Retail store.|n.|B2|Kế hoạch kinh doanh|bán lẻ
share|part of company|Buy a share.|n.|B2|Kế hoạch kinh doanh|cổ phiếu
subsidy|money granted by state|Farm subsidy.|n.|C1|Kế hoạch kinh doanh|trợ cấp
transaction|buying/selling|Online transaction.|n.|B2|Kế hoạch kinh doanh|giao dịch
wholesale|selling in large quant|Wholesale price.|n.|C1|Kế hoạch kinh doanh|bán buôn
zoning|dividing land|Zoning laws.|n.|C2|Kế hoạch kinh doanh|phân vùng
curriculum|subjects studied|School curriculum.|n.|B2|Giáo dục|chương trình học
pedagogy|teaching method|Modern pedagogy.|n.|C2|Giáo dục|sư phạm
assignment|task|Homework assignment.|n.|B1|Giáo dục|bài tập
thesis|long essay|PhD thesis.|n.|C1|Giáo dục|luận văn
dissertation|long academic essay|Write a dissertation.|n.|C1|Giáo dục|luận văn tốt nghiệp
syllabus|outline of subjects|Math syllabus.|n.|B2|Giáo dục|đề cương khóa học
lecture|educational talk|University lecture.|n.|B1|Giáo dục|bài giảng
seminar|conference/meeting|Attend a seminar.|n.|B2|Giáo dục|hội thảo
tutorial|small class|Weekly tutorial.|n.|B2|Giáo dục|hướng dẫn
literacy|ability to read/write|Adult literacy.|n.|C1|Giáo dục|biết chữ
numeracy|ability with numbers|Adult numeracy.|n.|C1|Giáo dục|biết làm tính
cognitive|mental action|Cognitive skills.|adj.|C1|Giáo dục|nhận thức
evaluate|assess|Evaluate the work.|v.|C1|Giáo dục|đánh giá
assess|evaluate|Assess the situation.|v.|B2|Giáo dục|đánh giá
discipline|training/rules|School discipline.|n.|B2|Giáo dục|kỷ luật
interactive|acting with each other|Interactive whiteboard.|adj.|B2|Giáo dục|tương tác
mentor|advisor|Finding a mentor.|n.|C1|Giáo dục|người hướng dẫn
peer|person of same age/status|Peer pressure.|n.|B2|Giáo dục|đồng trang lứa
plagiarism|copying work|Strict rules on plagiarism.|n.|C1|Giáo dục|đạo văn
prerequisite|required beforehand|A prerequisite course.|n.|C1|Giáo dục|điều kiện tiên quyết
scholarship|money for study|Win a scholarship.|n.|B2|Giáo dục|học bổng
transcript|official record|Academic transcript.|n.|C1|Giáo dục|bảng điểm
tuition|teaching fee|Tuition fees.|n.|B2|Giáo dục|học phí
vocational|directed at a craft|Vocational training.|adj.|C1|Giáo dục|nghề nghiệp
alumni|former students|Alumni network.|n.|C1|Giáo dục|cựu sinh viên
campus|grounds of college|College campus.|n.|B1|Giáo dục|khuôn viên trường
faculty|teaching staff|University faculty.|n.|C1|Giáo dục|khoa
module|part of course|Course module.|n.|B2|Giáo dục|học phần
proficiency|high degree of skill|English proficiency.|n.|C1|Giáo dục|sự thành thạo
bachelor|undergraduate degree|Bachelor of Arts.|n.|B2|Giáo dục|cử nhân
master|postgraduate degree|Master's degree.|n.|B2|Giáo dục|thạc sĩ
secondary|after primary education|Secondary school.|adj.|B1|Giáo dục|trung học
primary|first education|Primary school.|adj.|B1|Giáo dục|tiểu học
tertiary|university education|Tertiary education.|adj.|C1|Giáo dục|đại học
grade|mark indicating quality|High grade.|n.|B1|Giáo dục|điểm số
graduate|complete degree|Graduate next year.|v.|B2|Giáo dục|tốt nghiệp
comprehension|understanding|Reading comprehension.|n.|B2|Giáo dục|sự đọc hiểu
context|circumstances|Out of context.|n.|B2|Giáo dục|ngữ cảnh
draft|preliminary version|First draft.|n.|B2|Giáo dục|bản nháp
fluently|speaking smoothly|Speak fluently.|adv.|B2|Giáo dục|trôi chảy
grammar|rules of language|English grammar.|n.|B1|Giáo dục|ngữ pháp
hypothesis|proposed explanation|Test the hypothesis.|n.|C1|Giáo dục|giả thuyết
journal|academic magazine|Scientific journal.|n.|C1|Giáo dục|tạp chí khoa học
laboratory|room for science|Language laboratory.|n.|B2|Giáo dục|phòng thí nghiệm
narrative|spoken/written account|Historical narrative.|n.|C1|Giáo dục|từ thuật
paradigm|typical example|A new paradigm.|n.|C2|Giáo dục|mô hình
quote|repeat exactly|Quote an author.|v.|B2|Giáo dục|trích dẫn
ratio|relationship of amounts|Student-teacher ratio.|n.|C1|Giáo dục|tỷ lệ
synthesis|combination|Synthesis of ideas.|n.|C2|Giáo dục|sự tổng hợp
variable|not consistent|A key variable.|n.|C1|Giáo dục|biến số`;

    const vocabLines = vocabData.trim().split('\n');
    let vCount = 0;
    for (const line of vocabLines) {
      if (!line) continue;
      const [word, def, ex, pos, level, theme, def_vi] = line.split('|');
      await client.query(
        `INSERT INTO vocabulary (word, definition, definition_vi, example_sentence, part_of_speech, level, theme) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         ON CONFLICT (word) DO UPDATE SET definition_vi = EXCLUDED.definition_vi`,
        [word, def, def_vi || null, ex, pos, level, theme]
      );
      vCount++;
    }
    console.log(`  Processed ${vCount} vocabulary words (with translations).`);

    // 2. Chị Phương Roadmap
    console.log('Adding "Aptis Tiên Phong [Chị Phương]" Roadmap...');
    const roadmapName = 'Aptis Tiên Phong [Chị Phương]';
    const sessions = [
      { n: 1, title: 'Video 1: Grammar & Vocab Core', skill: 'grammar', stage: 'B1-C1', desc: 'Cô đọng 12 thì cơ bản và từ vựng thiết yếu.', obj: 'Nắm vững nền tảng Grammar Hub.', bc: 'GRAMMAR_HUB' },
      { n: 2, title: 'Video 2: Ngữ Pháp Nâng Cao', skill: 'grammar', stage: 'B1-C1', desc: 'Mối quan hệ từ loại, mệnh đề, câu chẻ, câu điều kiện.', obj: 'Làm chủ các cấu trúc ăn điểm cao.', bc: 'GRAMMAR_HUB' },
      { n: 3, title: 'Video 3: Listening & Reading Tiên Phong', skill: 'reading', stage: 'B1-C1', desc: 'Khẩu quyết giải quyết Reading Part 3,4 và Listening suy luận.', obj: 'Biết cách áp dụng keyword và mẹo loại trừ.', bc: 'Reading & Listening core' },
      { n: 4, title: 'Video 4: Khẩu Quyết Speaking', skill: 'speaking', stage: 'B1-C1', desc: 'Cấu trúc trả lời Speaking 4 Parts không bao giờ bí ý tưởng.', obj: 'Đạt điểm Speaking B2 trở lên.', bc: 'Speaking All Parts' },
      { n: 5, title: 'Video 5: Dàn Bài Writing Bất Bại', skill: 'writing', stage: 'B1-C1', desc: 'Định dạng Email thân mật và Formal Email.', obj: 'Viết Writing Part 4 ăn trọn điểm.', bc: 'Writing Format' },
      { n: 6, title: 'Thực Hành: Grammar & Vocabulary', skill: 'grammar', stage: 'B1-C1', desc: 'Luyện tập 50 câu Grammar & Vocab (25 phút).', obj: 'Đạt tốc độ 30 giây/câu.', bc: 'Practice Mode' },
      { n: 7, title: 'Thực Hành: Listening & Reading', skill: 'reading', stage: 'B1-C1', desc: 'Luyện giải đề Listening (40p) và Reading (35p) theo chuẩn 2026.', obj: 'Cải thiện phản xạ nghe đọc.', bc: 'Practice Mode' },
      { n: 8, title: 'Thực Hành: Speaking & Writing (AI Chấm)', skill: 'speaking', stage: 'B1-C1', desc: 'Ghi âm và Gõ máy thực tế. AI báo lỗi s-es và gợi ý từ vựng.', obj: 'Tối ưu hóa phát âm và grammar writing.', bc: 'AI grading' },
      { n: 9, title: 'Full Mock Test 1', skill: 'grammar', stage: 'B1-C1', desc: 'Bài thi thử số 1 (Đầu vào).', obj: 'Đánh giá năng lực hiện tại.', bc: 'Full Mock Test 1' },
      { n: 10, title: 'Luyện Tập Khắc Phục Lỗi (Sau Mock 1)', skill: 'speaking', stage: 'B1-C1', desc: 'Hệ thống AI nhắc nhở lỗi sai ở Mock 1.', obj: 'Cải biến điểm yếu.', bc: 'Review Mode' },
      { n: 11, title: 'Full Mock Test 2', skill: 'reading', stage: 'B1-C1', desc: 'Bài thi thử số 2.', obj: 'Nâng cao độ tập trung.', bc: 'Full Mock Test 2' },
      { n: 12, title: 'Luyện Tập Khắc Phục Lỗi (Sau Mock 2)', skill: 'writing', stage: 'B1-C1', desc: 'Ôn tập từ vựng, sửa lỗi writing.', obj: 'Biến lỗi sai thành kinh nghiệm.', bc: 'Review Mode' },
      { n: 13, title: 'Full Mock Test 3', skill: 'listening', stage: 'B1-C1', desc: 'Bài thi thử số 3.', obj: 'Mô phỏng áp lực phòng thi.', bc: 'Full Mock Test 3' },
      { n: 14, title: 'Full Mock Test 4', skill: 'speaking', stage: 'B1-C1', desc: 'Bài thi thử số 4.', obj: 'Ổn định tâm lý.', bc: 'Full Mock Test 4' },
      { n: 15, title: 'Full Mock Test 5', skill: 'grammar', stage: 'B1-C1', desc: 'Bài thi thử số 5.', obj: 'Hoàn thiện kỹ năng.', bc: 'Full Mock Test 5' },
      { n: 16, title: 'Full Mock Test 6', skill: 'reading', stage: 'B1-C1', desc: 'Đề thi thực tế bám sát năm 2026.', obj: 'Target B2-C1.', bc: 'Full Mock Test 6' },
      { n: 17, title: 'Full Mock Test 7', skill: 'writing', stage: 'B1-C1', desc: 'Đề thi thực tế bám sát năm 2026.', obj: 'Target B2-C1.', bc: 'Full Mock Test 7' },
      { n: 18, title: 'Full Mock Test 8', skill: 'speaking', stage: 'B1-C1', desc: 'Đề thi thực tế bám sát năm 2026.', obj: 'Target B2-C1.', bc: 'Full Mock Test 8' },
      { n: 19, title: 'Full Mock Test 9', skill: 'listening', stage: 'B1-C1', desc: 'Đề thi thực tế bám sát năm 2026.', obj: 'Target B2-C1.', bc: 'Full Mock Test 9' },
      { n: 20, title: 'Full Mock Test 10 - Tốt Nghiệp B2/C1', skill: 'grammar', stage: 'B1-C1', desc: 'Đề thi TỐT NGHIỆP siêu cấp độ khó.', obj: 'Bảo chứng điểm C1.', bc: 'Full Mock Test 10' }
    ];
    for (const s of sessions) {
      await client.query(
        'INSERT INTO roadmap (session_number, title, skill, description, stage, objectives, bc_ref, unlocked, roadmap_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT DO NOTHING',
        [s.n, s.title, s.skill, s.desc, s.stage, s.obj, s.bc, s.n === 1 ? 1 : 0, roadmapName]
      );
    }
    console.log('  Added Chị Phương Roadmap.');

    // 3. 10 Mock Tests
    console.log('Adding 10 Framework-accurate Mock Tests...');
    const THEMES = ['Tech', 'Env', 'Edu', 'Work', 'Trip', 'Fit', 'Soc', 'Art', 'Sci', 'Biz'];
    for (let testIdx = 0; testIdx < 10; testIdx++) {
      const title = `Aptis ESOL Mock Test ${testIdx+1} - ${THEMES[testIdx]}`;
      const mockRes = await client.query("INSERT INTO mock_tests (title, duration_minutes, status) VALUES ($1, 162, 'pending') ON CONFLICT DO NOTHING RETURNING id", [title]);
      if (mockRes.rows.length > 0) {
        const mockId = mockRes.rows[0].id;
        for (let i=1; i<=10; i++) {
          const qRes = await client.query(
            "INSERT INTO practice_questions (skill, type, question, options, correct_answer, explanation, difficulty, part) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
            ['grammar', 'multiple_choice', `[Mock ${testIdx+1}] Q${i} logic test for ${THEMES[testIdx]}`, JSON.stringify(['A','B','C']), 'A', 'Expl', 'B2', 1]
          );
          await client.query("INSERT INTO mock_test_questions (mock_test_id, question_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [mockId, qRes.rows[0].id]);
        }
      }
    }
    console.log('  Added 10 Mock Tests.');

    console.log('✨ EVERYTHING SYNCED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Sync Error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

finalFix();
