// Затем импортируем модули, которые используют API_BASE_URL
import * as courseApi from "./courseApi";
import * as userApi from "./userApi";

export { courseApi, userApi };

// GET /api/courses/ получить все курсы
// GET /api/courses/{id} получить конкретный

// POST /api/courses/ создание курса
// DELETE /api/courses/{id} удаление курса
// PUT /api/courses/{id} редактирование курса

// POST /api/courses/{id}/info/ создание блока информации
// DELETE /api/courses/{id}/info/{id info} удаление блока информации
// PUT /api/courses/{id}/info/{id info} редактирование блока информации

// POST /api/courses/{id}/sections/ создание раздела
// DELETE /api/courses/{id}/sections/{id sections} удаление раздела
// PUT /api/courses/{id}/sections/{id sections} редактирование раздела

// POST /api/courses/{id}/sections/{id sections}/content создание урока
// DELETE /api/courses/{id}/sections/{id sections}/content удаление урока
// PUT /api/courses/{id}/sections/{id sections}/content редактирование урока

// POST /api/courses/{id}/sections/{id sections}/content/{id content} создание описания урока
// DELETE /api/courses/{id}/sections/{id sections}/content/{id content} удаление описания урока
// PUT /api/courses/{id}/sections/{id sections}/content/{id content} редактирование описания урока
